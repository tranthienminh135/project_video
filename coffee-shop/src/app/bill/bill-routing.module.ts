import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListBillComponent} from './list-bill/list-bill.component';
import {DetailBillComponent} from './detail-bill/detail-bill.component';
import {AdminStaffGuard} from "../login/authguard/admin-staff.guard";


const routes: Routes = [
  {
    path: 'bill',
    component: ListBillComponent,
    canActivate: [AdminStaffGuard]
  },
  {
    path: 'bill/detail',
    component: DetailBillComponent,
    canActivate: [AdminStaffGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule {
}
