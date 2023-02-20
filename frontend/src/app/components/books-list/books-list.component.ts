import {Component, OnInit, ViewChild} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Observable} from 'rxjs';
import {Page} from '../../models/page';
import {Book} from '../../models/book';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$: Observable<Page<Book> | Error>;
  bookList = new MatTableDataSource();
  columns: string[] = ["title", "author", "year", "status"]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.books$ = this.bookService.getBooks({});
    this.books$.subscribe((result) => {
      console.log(result.content)
      this.bookList.data = result.content;
    });
  }

  ngAfterViewInit() {
    this.bookList.paginator = this.paginator;
    this.bookList.sort = this.sort;
  }

}
