import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CharacterSheetPageRoutingModule } from './character-sheet-routing.module';
import { CharacterSheetPage } from './character-sheet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterSheetPageRoutingModule
  ],
  declarations: [
    CharacterSheetPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CharacterSheetPageModule {}