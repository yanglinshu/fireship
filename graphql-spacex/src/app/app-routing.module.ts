import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchDetailComponent } from './launch-detail/launch-detail.component';
import { LaunchListComponent } from './launch-list/launch-list.component';

const routes: Routes = [
  {
    path: '',
    component: LaunchListComponent,
  },
  {
    path: ':id',
    component: LaunchDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
