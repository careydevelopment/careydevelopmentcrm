import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AlertService } from 'carey-alert';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';
import { DisplayValueMap } from '../../../models/name-value-map';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { sources } from '../../../models/source';
import { addressTypes } from '../../../models/address-type';
import { phoneTypes } from '../../../models/phone-type';
import { accountStatuses } from '../constants/account-status';
import { industries } from '../constants/industry';
import { Account } from '../models/account';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  availableSources: DisplayValueMap[] = sources;
  availableAccountStatuses: DisplayValueMap[] = accountStatuses;
  availableIndustries: DisplayValueMap[] = industries;

  loading: boolean = true;
  account: Account = {} as Account;

  constructor(private route: ActivatedRoute, private accountService: AccountService,
    private alertService: AlertService, private displayValueMapService: DisplayValueMapService,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    let account$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.accountService.fetchById(params.get('id')))
    );

    account$.subscribe(
      (account) => this.handleResponse(account),
      err => this.handleError(err)
    );
  }

  private handleResponse(account: Account) {
    this.account = account;
    this.loading = false;
    this.breadcrumbService.updateBreadcrumb("Edit " + this.account.name);
  }

  private handleError(err: Error) {
    console.log(err);
    this.loading = false;

    let alertMessage: string = 'Something went wrong, please call support';

    if (err instanceof HttpErrorResponse) {
      if (err.status) {
        if (err.status == 404) {
          alertMessage = 'Account with that ID does not exist';
        }
      }
    }

    this.alertService.error(alertMessage);
  }
}
