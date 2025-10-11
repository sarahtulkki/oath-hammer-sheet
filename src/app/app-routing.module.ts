import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'character-sheet',
    pathMatch: 'full'
  },
  {
    path: 'character-sheet',
    loadChildren: () => import('./pages/character-sheet/character-sheet.module').then(m => m.CharacterSheetPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
