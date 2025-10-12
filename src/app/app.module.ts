import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Components
import { CharacterMenuPopoverComponent } from './components/character-menu-popover/character-menu-popover.component';
import { StatCounterComponent } from './components/stat-counter/stat-counter.component';
import { SlotManagerComponent } from './components/slot-manager/slot-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterMenuPopoverComponent,
    StatCounterComponent,
    SlotManagerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
