import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '../../../../ui/alert/alert.service';
import { Email } from '../models/email';
import { EmailService } from '../service/email.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  displayedColumns: string[] = ['action', 'from', 'subject'];

  private loading: boolean = true;
  private emails: Email[];
  dataSource: MatTableDataSource<Email>;


  constructor(private emailService: EmailService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadInbox();
  }

  private loadInbox() {
    this.emailService.fetchInbox().subscribe(
      (emails: Email[]) => this.handleInboxRetrieval(emails),
      (err: Error) => this.handleInboxError(err)
    );
  }

  private handleInboxRetrieval(emails: Email[]) {
    console.log(emails);
    this.emails = emails;
    this.dataSource = new MatTableDataSource(emails);
    this.loading = false;
  }

  private handleInboxError(err: Error) {
    console.error(err);
    this.alertService.error("Problem loading emails!");
    this.loading = false;
  }
}
