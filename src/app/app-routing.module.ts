import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslationFormComponent } from './components/translation-form/translation-form.component';
import { TranslationListComponent } from './components/translation-list/translation-list.component';

const routes: Routes = [
  { path: '', component: TranslationFormComponent },
  { path: 'list', component: TranslationListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
