import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from 'carey-alert';
import { Email } from '../models/email';
import { EmailService } from '../service/email.service';
import { DateService } from '../../../../services/date.service';
import { UiUtil } from '../../../../util/ui-util';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleApiError } from '../models/google-api-error';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['action', 'from', 'subject', 'date'];

  dataSource: MatTableDataSource<Email>;
  dataLoading: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private alertService: AlertService, private router: Router,
    private emailService: EmailService, private dateService: DateService,
    private uiUtil: UiUtil) {
  }

  ngOnInit(): void {
    this.loadInbox();
    this.uiUtil.scrollToTop();
  }

  ngAfterViewInit(): void {
    //in case the viewchild didn't load during ngOnInit (usually because the app loaded the cached emails)
    //this is necessary to ensure that the paginator gets instantiated
    if (this.dataSource) {
      if (!this.dataSource.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      if (!this.dataSource.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  private createFilter(): (email: Email, filter: string) => boolean {
    let filterFunction = function (email: Email, filter): boolean {
      let searchTerms = JSON.parse(filter);

      //just a default for now - placeholder for when we do real sorting later
      return (email.subject != null);
    }

    return filterFunction;
  }

  private loadInbox(refresh?: boolean) {
    if (refresh) this.dataLoading = true;

    this.emailService.fetchInbox(refresh).subscribe(
      (emails: Email[]) => this.handleInboxRetrieval(emails),
      (err: Error) => this.handleInboxError(err)
    );
  }

  private handleInboxError(err: Error) {
    if (err instanceof HttpErrorResponse) {
      let httpError: HttpErrorResponse = <HttpErrorResponse>err;
      let googleApiError: GoogleApiError = httpError.error;

      if (googleApiError.error == 'invalid_grant') {
        let route = '/user/email/email-choice';
        this.router.navigate([route]);
      } else {
        this.alertService.error("Problem loading emails!");
      }
    } else {
      this.alertService.error("Problem loading emails!");
    }

    this.dataLoading = false;
  }

  private handleInboxRetrieval(emails: Email[]) {
    this.dataSource = new MatTableDataSource(emails);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.dataSource.filterPredicate = this.createFilter();

    this.dataLoading = false;
  }

  getSubjectSnippetDisplay(email: Email): string {
    let subject: string = email.subject;
    let snippet: string = email.snippet;

    let display: string = `${subject} - ${snippet}`;
    return display;
  }

  viewMessage(id: string) {
    let route = '/user/email/message';
    this.router.navigate([route], { queryParams: { id: id } });
  }

  composeEmail() {
    let route = '/user/email/compose-email';
    this.router.navigate([route]);
  }
}
