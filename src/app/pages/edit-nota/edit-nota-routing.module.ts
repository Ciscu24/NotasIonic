import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditNotaPage } from './edit-nota.page';

const routes: Routes = [
  {
    path: '',
    component: EditNotaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditNotaPageRoutingModule {}
