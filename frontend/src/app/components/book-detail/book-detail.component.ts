import {Component, Inject, OnInit} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Checkout} from "../../models/checkout";
import {Page} from "../../models/page";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CheckoutService} from "../../services/checkout.service";
import {v4 as uuidv4} from "uuid";

export interface DialogData {
  id: string;
  book: Book;
}

export interface CheckoutDialogData {
  firstName: string;
  lastName: string;
  book: Book;
  dueDate: string;
}

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book$: Observable<Book | Error>;
  checkout$: Observable<Page<Checkout> | Error>;
  checkouts: Checkout[] = [];

  id: string;
  book: Book;


  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    public dialog: MatDialog
  ) {
  }

  openDeleteDialog(id: string) {
    const dialogRef = this.dialog.open(DeleteDialog, {
      data: {id: id}
    });
  }

  openCheckoutDialog(book: Book) {
    const dialogRef = this.dialog.open(CheckoutDialog, {
      data: {book: book}
    });
  }


  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params.id))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'dialogs/delete-dialog.component.html',
})
export class DeleteDialog {

  response: any;

  constructor(
    private _snackBar: MatSnackBar,
    private bookService: BookService,
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  deleteBook() {
    this.response = this.bookService.deleteBook(this.data.id);
    this.response.subscribe(result => {
      if (result == null) {
        this._snackBar.open("Book deleted sucessfully", "Close", {duration: 3000});
        this.dialogRef.close();
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}


@Component({
  selector: 'checkout-dialog',
  templateUrl: 'dialogs/checkout-dialog.component.html',
})
export class CheckoutDialog {

  response: any;
  newCheckout: Checkout
  date: string;

  constructor(
    private _snackBar: MatSnackBar,
    private checkoutService: CheckoutService,
    public dialogRef: MatDialogRef<CheckoutDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CheckoutDialogData,
  ) {
  }

  checkoutBook() {
    this.date = new Date().toJSON().slice(0, 10);
    this.newCheckout = {
      id: uuidv4(),
      borrowerFirstName: this.data.firstName,
      borrowerLastName: this.data.lastName,
      borrowedBook: this.data.book,
      checkedOutDate: this.date,
      dueDate: this.data.dueDate,
      returnedDate: null
    }
    this.response = this.checkoutService.saveCheckout(this.newCheckout);
    this.response.subscribe(result => {
      if (result == null) {
        this._snackBar.open("Checkout added successfully", "Close", {duration: 3000});
        this.dialogRef.close();
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
