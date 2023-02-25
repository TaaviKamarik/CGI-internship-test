import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutService} from '../../services/checkout.service';
import {Observable} from 'rxjs';
import {Page} from '../../models/page';
import {Checkout} from '../../models/checkout';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-books-list',
  templateUrl: './checkouts-list.component.html',
  styleUrls: ['./checkouts-list.component.scss']
})
export class CheckoutsListComponent implements OnInit {

  checkouts$: Observable<Page<Checkout> | Error>;
  checkoutList = new MatTableDataSource();
  columns: string[] = ["borrowerFirstName", "borrowerLastName", "bookTitle", "checkoutDate", "dueDate", "returnDate"]
  pageIndex: number = 0;
  paginatorInfo$;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  getPageDetails(event: any) {
    this.pageIndex = event.pageIndex
    console.log(this.pageIndex)
    this.checkouts$ = this.checkoutService.getCheckouts({pageIndex: this.pageIndex})
    this.checkouts$.subscribe((result) => {
      this.paginatorInfo$ = result;
      this.checkoutList.data = this.paginatorInfo$.content;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.checkoutList.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private checkoutService: CheckoutService,
  ) {
  }

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.checkouts$ = this.checkoutService.getCheckouts({pageIndex: this.pageIndex});
    this.checkouts$.subscribe((result) => {
      this.paginatorInfo$ = result;
      console.log(result)
      this.checkoutList.data = this.paginatorInfo$.content;
    });
  }

  ngAfterViewInit() {
    this.checkoutList.paginator = this.paginator;
    this.checkoutList.sort = this.sort;
  }

}
