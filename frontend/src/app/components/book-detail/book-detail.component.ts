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

export interface DialogData {
  id: string;
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

  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params.id))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.component.html',
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


