import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BooksListComponent} from './components/books-list/books-list.component';
import {BookDetailComponent} from './components/book-detail/book-detail.component';
import {CheckoutsListComponent} from "./components/checkouts-list/checkouts-list.component";

const routes: Routes = [
  {path: '', redirectTo: 'books', pathMatch: 'full'},
  {path: 'checkouts', redirectTo: 'checkouts', pathMatch: 'full'},
  {path: 'books', component: BooksListComponent},
  {path: 'checkouts', component: CheckoutsListComponent},
  {path: 'books/:id', component: BookDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
