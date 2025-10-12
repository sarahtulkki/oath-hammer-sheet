// src/app/components/character-menu-popover/character-menu-popover.component.ts
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-character-menu-popover',
  templateUrl: './character-menu-popover.component.html',
  standalone: false
})
export class CharacterMenuPopoverComponent {
  isGM: boolean = false;
  onExport?: () => void;
  onImport?: () => void;
  onViewAll?: () => void;

  constructor(private modalCtrl: ModalController) {}

  handleExport() {
    this.modalCtrl.dismiss();
    if (this.onExport) this.onExport();
  }

  handleImport() {
    this.modalCtrl.dismiss();
    if (this.onImport) this.onImport();
  }

  handleViewAll() {
    this.modalCtrl.dismiss();
    if (this.onViewAll) this.onViewAll();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}