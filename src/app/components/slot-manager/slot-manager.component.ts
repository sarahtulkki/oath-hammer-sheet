
import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { CharacterSlot, MAX_CHARACTER_SLOTS } from '../../models/character.model';

@Component({
  selector: 'app-slot-manager',
  standalone: false,
  template: `
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Character Slots</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item 
          *ngFor="let slot of slots; let i = index" 
          [class.active-slot]="i === activeSlotIndex"
          button>
          <ion-icon 
            [name]="slot.character ? 'person' : 'person-outline'" 
            slot="start"
            [color]="i === activeSlotIndex ? 'white' : 'medium'">
          </ion-icon>
          
          <ion-label>
            <h2>Slot {{ i + 1 }}</h2>
            <p>{{ getSlotSummary(i) }}</p>
            <p class="slot-date" *ngIf="slot.character">
              Last modified: {{ slot.lastModified | date:'short' }}
            </p>
          </ion-label>
          
          <ion-button 
            fill="clear" 
            slot="end" 
            (click)="loadSlot(i, $event)"
            [color]="i === activeSlotIndex ? 'white' : 'medium'"
            *ngIf="slot.character">
            Load
          </ion-button>
          
          <ion-button 
            fill="clear" 
            slot="end" 
            (click)="createNew(i, $event)"
            *ngIf="!slot.character"
            [color]="i === activeSlotIndex ? 'white' : 'medium'">
            Create
          </ion-button>
          
          <ion-button 
            fill="clear" 
            color="danger" 
            slot="end" 
            (click)="deleteSlot(i, $event)"
            *ngIf="slot.character">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .active-slot {
      --background: var(--primary-red);
      color: white;
      
      p {
        color: white;
      }

      .slot-date {
        color: white;
      }

      ion-icon {
        color: white !important;
      }

      ion-button {
        --color: white !important;
      }
    }

    ion-button {
      font-weight: 600;
    }

    .slot-date {
      font-size: 0.8em;
      color: var(--ion-color-medium);
      margin-top: 4px;
    }

    ion-list {
      background: transparent;
    }

    ion-item {
      --padding-start: 16px;
      --padding-end: 16px;
      margin-bottom: 8px;
      border-radius: 8px;
    }
  `]
})

export class SlotManagerComponent implements OnInit {
  slots: CharacterSlot[] = [];
  activeSlotIndex: number = 0;

  constructor(
    private storage: StorageService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.storage.characterSlots.subscribe(slots => {
      this.slots = slots;
    });

    this.storage.activeSlotIndex.subscribe(index => {
      this.activeSlotIndex = index;
    });
  }

  getSlotSummary(index: number): string {
    return this.storage.getSlotSummary(index);
  }

  async loadSlot(index: number, event: Event) {
    event.stopPropagation();
    this.storage.loadCharacterFromSlot(index);
    await this.close(true);
  }

  async createNew(index: number, event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertCtrl.create({
      header: 'Create Character',
      message: 'Create a new character in this slot?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: () => {
            this.storage.createCharacter(index);
            this.storage.loadCharacterFromSlot(index);
            this.close(true);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteSlot(index: number, event: Event) {
    event.stopPropagation();
    
    const slot = this.slots[index];
    const characterName = slot.character?.name || 'Unnamed';
    
    const alert = await this.alertCtrl.create({
      header: 'Delete Character',
      message: `Are you sure you want to delete "${characterName}"? This cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.storage.deleteCharacterFromSlot(index);
            
            // If we deleted the active slot, load another
            if (index === this.activeSlotIndex) {
              // Find first non-empty slot or slot 0
              const nextSlot = this.slots.findIndex((s, i) => i !== index && s.character);
              this.storage.loadCharacterFromSlot(nextSlot >= 0 ? nextSlot : 0);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async close(slotChanged: boolean = false) {
    await this.modalCtrl.dismiss({ slotChanged });
  }
}