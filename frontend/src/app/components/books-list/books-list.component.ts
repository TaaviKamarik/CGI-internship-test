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
  columns: string[] = ["title", "author", "year", "status", "edit"]
  bookStatuses: string[] = ['AVAILABLE', 'BORROWED', 'RETURNED', 'DAMAGED', 'PROCESSING']
  pageIndex: number = 0;
  paginatorInfo$;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  getPageDetails(event: any) {
    this.pageIndex = event.pageIndex
    console.log(this.pageIndex)
    this.books$ = this.bookService.getBooks({pageIndex: this.pageIndex})
    this.books$.subscribe((result) => {
      this.paginatorInfo$ = result;
      this.bookList.data = this.paginatorInfo$.content;
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bookList.filter = filterValue.trim().toLowerCase();
  }

  applyStatusFilter(value: string) {
    this.bookList.filter = value.trim();
  }

  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    this.books$ = this.bookService.getBooks({pageIndex: this.pageIndex});
    this.books$.subscribe((result) => {
      this.paginatorInfo$ = result;
      this.bookList.data = this.paginatorInfo$.content;
    });


  }

  ngAfterViewInit() {
    this.bookList.paginator = this.paginator;
    this.bookList.sort = this.sort;
  }

}
