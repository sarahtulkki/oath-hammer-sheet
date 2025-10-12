import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { Character, Skill, LINEAGES, CLASSES_BY_LINEAGE, AVAILABLE_OATHS, applyClassSkillDefaults } from '../../models/character.model';
import { StorageService } from '../../services/storage.service';
import { OwlbearService } from '../../services/owlbear.service';
import { SlotManagerComponent } from '../../components/slot-manager/slot-manager.component';
import { CharacterMenuPopoverComponent } from '../../components/character-menu-popover/character-menu-popover.component';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.page.html',
  styleUrls: ['./character-sheet.page.scss'],
  standalone: false
})
export class CharacterSheetPage implements OnInit, OnDestroy {
  character: Character | null = null;
  lineages = LINEAGES;
  availableClasses: string[] = [];
  allOaths = AVAILABLE_OATHS;
  
  isOwlbearReady = false;
  isGM = false;
  
  private previousClass: string = '';
  
  private destroy$ = new Subject<void>();
  private autoSave$ = new Subject<void>();

  constructor(
    private storage: StorageService,
    private owlbear: OwlbearService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // Load current character
    this.storage.currentCharacter
      .pipe(takeUntil(this.destroy$))
      .subscribe(character => {
        this.character = character;
        if (character?.lineage) {
          this.updateAvailableClasses(character.lineage);
        }
        // Store the current class for comparison
        this.previousClass = character?.class || '';
      });

    // Setup Owlbear integration
    this.owlbear.isReady
      .pipe(takeUntil(this.destroy$))
      .subscribe(ready => {
        this.isOwlbearReady = ready;
        if (ready) {
          this.syncWithOwlbear();
        }
      });

    this.owlbear.isGM
      .pipe(takeUntil(this.destroy$))
      .subscribe(isGM => {
        this.isGM = isGM;
      });

    // Setup auto-save with debounce
    this.autoSave$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(1000)
      )
      .subscribe(() => {
        this.performSave();
      });

    // Set popover size for Owlbear
    if (this.isOwlbearReady) {
      this.owlbear.setPopoverSize(500, 800);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Sync character with Owlbear room
  private async syncWithOwlbear() {
    if (!this.isOwlbearReady) return;

    try {
      const owlbearChar = await this.owlbear.loadCharacterFromRoom();
      if (owlbearChar && !this.character) {
        // Load from Owlbear if no local character
        const slotIndex = this.storage.getActiveSlotIndex();
        this.storage.importCharacterToSlot(slotIndex, owlbearChar);
      }
    } catch (error) {
      console.error('Error syncing with Owlbear:', error);
    }
  }

  // Handle lineage change
  onLineageChange() {
    if (this.character) {
      this.updateAvailableClasses(this.character.lineage);
      this.character.class = ''; // Reset class when lineage changes
      this.previousClass = '';
      this.saveCharacter();
    }
  }

  // Handle class change with confirmation
  async onClassChange(event: any) {
    if (!this.character) return;

    const newClass = event.detail.value;

    // If there was a previous class selected, confirm before changing
    if (this.previousClass && this.previousClass !== '' && this.previousClass !== newClass) {
      const alert = await this.alertCtrl.create({
        header: 'Confirm Class Change',
        message: 'Changing your class will reset all skill ranks to the new class defaults. Do you want to continue?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              // Revert to previous class
              if (this.character) {
                this.character.class = this.previousClass;
              }
            }
          },
          {
            text: 'Continue',
            handler: () => {
              // Apply new class defaults
              if (this.character) {
                applyClassSkillDefaults(this.character, newClass);
                this.previousClass = newClass;
                this.saveCharacter();
              }
            }
          }
        ]
      });

      await alert.present();
    } else {
      // First time selecting a class or no previous class
      applyClassSkillDefaults(this.character, newClass);
      this.previousClass = newClass;
      this.saveCharacter();
    }
  }

  // Update available classes based on lineage
  private updateAvailableClasses(lineage: string) {
    this.availableClasses = CLASSES_BY_LINEAGE[lineage] || [];
  }

  // Save character (with auto-save debounce)
  saveCharacter() {
    this.autoSave$.next();
  }

  // Perform actual save
  private async performSave() {
    if (!this.character) return;

    // Save to local storage
    this.storage.updateCurrentCharacter(this.character);

    // Save to Owlbear if available
    if (this.isOwlbearReady) {
      try {
        await this.owlbear.saveCharacterToRoom(this.character);
      } catch (error) {
        console.error('Error saving to Owlbear:', error);
      }
    }
  }

  // Open slot manager modal
  async openSlotManager() {
    const modal = await this.modalCtrl.create({
      component: SlotManagerComponent,
      cssClass: 'slot-manager-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.slotChanged) {
      // Character was changed in slot manager
      this.character = this.storage.getCurrentCharacter();
    }
  }

  // Open menu modal
  async openMenu() {
    const modal = await this.modalCtrl.create({
      component: CharacterMenuPopoverComponent,
      cssClass: 'character-menu-modal',
      componentProps: {
        isGM: this.isGM,
        onExport: () => this.exportCharacter(),
        onImport: () => this.importCharacter(),
        onViewAll: () => this.viewAllCharacters()
      }
    });

    await modal.present();
  }

  // Export character to JSON
  exportCharacter() {
    if (!this.character) return;
    this.owlbear.exportCharacter(this.character);
  }

  // Import character from JSON
  async importCharacter() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event: any) => {
      const file = event.target?.files?.[0];
      if (!file) return;

      try {
        const character = await this.owlbear.importCharacter(file);
        
        const alert = await this.alertCtrl.create({
          header: 'Import Character',
          message: `Import "${character.name || 'Unnamed'}" to current slot?`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Import',
              handler: () => {
                const slotIndex = this.storage.getActiveSlotIndex();
                this.storage.importCharacterToSlot(slotIndex, character);
                this.owlbear.showNotification('Character imported!', 'SUCCESS');
              }
            }
          ]
        });

        await alert.present();
      } catch (error) {
        const alert = await this.alertCtrl.create({
          header: 'Import Error',
          message: 'Invalid character file',
          buttons: ['OK']
        });
        await alert.present();
      }
    };

    input.click();
  }

  // View all characters (GM feature)
  async viewAllCharacters() {
    if (!this.isGM || !this.isOwlbearReady) return;

    try {
      const allCharacters = await this.owlbear.getAllCharacters();
      
      if (allCharacters.length === 0) {
        const alert = await this.alertCtrl.create({
          header: 'No Characters',
          message: 'No player characters found in this room.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      // Show list of characters
      const characterList = allCharacters
        .map(c => `${c.playerName}: ${c.character.name || 'Unnamed'} (${c.character.lineage} ${c.character.class})`)
        .join('\n');

      const alert = await this.alertCtrl.create({
        header: 'Party Characters',
        message: characterList,
        buttons: ['OK']
      });

      await alert.present();
    } catch (error) {
      console.error('Error loading all characters:', error);
    }
  }

  // Track by index for ngFor to prevent re-rendering issues
  trackByIndex(index: number): number {
    return index;
  }

  // Get available oaths for dropdown (excluding already selected ones)
  getAvailableOaths(currentIndex: number): string[] {
    if (!this.character) {
      return this.allOaths;
    }

    // Get all selected oaths except the current one
    const selectedOaths = this.character.oaths
      .filter((oath, index) => index !== currentIndex && oath && oath.trim() !== '');

    // Return oaths that haven't been selected yet, or the current oath
    return this.allOaths.filter(oath => 
      !selectedOaths.includes(oath) || oath === this.character!.oaths[currentIndex]
    );
  }

  // Get skill attribute value based on skill name
  getSkillAttribute(skillName: string): string {
    if (!this.character) return '';

    // Extract attribute code from skill name (e.g., "Athletics (M)" -> "M")
    const match = skillName.match(/\(([^)]+)\)/);
    if (!match) return '';

    const attrCode = match[1];

    // Map attribute codes to character stats
    const attrMap: { [key: string]: number } = {
      'Int': this.character.intelligence,
      'WP': this.character.willpower,
      'M': this.character.might,
      'Ag': this.character.agility,
      'F': this.character.fate,
      'T': this.character.toughness
    };

    // Handle combined attributes (e.g., "Int / WP" or "Ag / M")
    if (attrCode.includes('/')) {
      const codes = attrCode.split('/').map(c => c.trim());
      const values = codes.map(code => attrMap[code] || 0);
      // Return the sum of all attribute values
      return values.reduce((sum, val) => sum + val, 0).toString();
    }

    // Single attribute
    return (attrMap[attrCode] || 0).toString();
  }

  // Calculate skill total (Ranks + Mod + Attr)
  calculateSkillTotal(skill: Skill): string {
    if (!this.character) return '0';

    const ranks = parseInt(skill.skillRanks) || 0;
    const mod = parseInt(skill.modifiers) || 0;
    const attr = parseInt(this.getSkillAttribute(skill.name)) || 0;

    return (ranks + mod + attr).toString();
  }
}