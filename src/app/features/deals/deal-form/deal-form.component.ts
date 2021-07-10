import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Contact } from '../../contacts/models/contact';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'carey-alert';
import { ValidatorFn, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Deal } from '../models/deal';
import { Product } from '../models/product';
import { DealStage } from '../models/deal-stage';
import { DateService } from '../../../services/date.service';
import { FormService } from '../../../services/form.service';
import { AccountLightweight } from '../models/account-lightweight';
import { ContactLightweight } from '../models/contact-lightweight';
import { Observable, forkJoin } from 'rxjs';
import { UserService } from 'carey-user';
import { SalesOwnerLightweight } from '../models/sales-owner-lightweight';
import { DealService } from '../service/deal.service';
import { ProductService } from '../service/product.service';
import { ContactService } from '../../contacts/services/contact.service';
import { SalesType } from '../models/sales-type';

//5 years
const maximumTimeSpan: number = 5 * 365 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-deal-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './deal-form.component.html',
  styleUrls: ['./deal-form.component.css']
})
export class DealFormComponent implements OnInit {

  @Input() contact: Contact;
  @Input() deal: Deal;

  pageTitle: string = 'Add Deal';
  loadingProduct: Product = <Product>{ name: 'Loading...' };
  selectedProduct: Product;
  contacts: Contact[];

  addingForContact: boolean = false;

  dealFormGroup: FormGroup;

  currentClosureDate: number;
  currentProduct: Product;
  showTotalAmount: boolean = false;

  availableProducts: Product[] = [this.loadingProduct];
  availableDealStages: DealStage[] = [];
  availableSalesTypes: SalesType[] = [];

  saving: boolean = false;
  loading: boolean = true;
  showDealStagesDropdown: boolean = false;

  prohibitedEdit: boolean = false;

  allProducts$: Observable<Product[]>;
  contacts$: Observable<Contact[]>;
  allSalesTypes$: Observable<SalesType[]>;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private fb: FormBuilder,
    private dealService: DealService, private dateService: DateService,
    private formService: FormService, private userService: UserService,
    private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.setDefaultDeal();
    this.loadData();
    this.createForm();
    this.intitializeCalendar();
    this.handleProhibition();
  }

  private handleProhibition() {
    if (this.prohibitedEdit) {
      this.dealFormGroup.disable();
    }
  }

  private setDefaultDeal() {
    if (!this.deal) this.deal = <Deal>{};
    else {
      this.pageTitle = 'Edit Deal';

      if (!this.deal.contact || this.deal.contact.salesOwner.id != this.userService.user.id) {
        this.alertService.error("This deal isn't yours to edit");
        this.prohibitedEdit = true;
      }

      if (this.deal.stage) {
        this.loadDealStages(this.deal.stage.salesType);

        if (this.deal.stage.name == 'Won' || this.deal.stage.name == 'Lost') {
          this.alertService.error(this.deal.stage.name + " deals can't be edited.");
          this.prohibitedEdit = true;
        }
      }

      this.showTotalAmount = true;
      this.currentProduct = this.deal.product;
    }
  }

  private intitializeCalendar() {
    if (this.deal.expectedClosureDate) {
      this.initializeCalendarForEdit();
    } else {
      this.initializeCalendarForAdd();
    }
  }

  private initializeCalendarForEdit() {
    this.currentClosureDate = this.deal.expectedClosureDate;

    this.setCalendarInputs();

    this.dealFormGroup.get('closureDate').setValue(new Date(this.deal.expectedClosureDate));
    this.dealFormGroup.get('closureDate').enable();
  }

  private initializeCalendarForAdd() {
    let currentDate: Date = new Date();
    let endDate: Date = new Date(currentDate.getTime() + (60 * 60 * 1000));

    this.dealFormGroup.get('closureDate').setValue(currentDate);
    this.dealFormGroup.get('closureDate').enable();

    this.currentClosureDate = endDate.getTime();

    this.setCalendarInputs();
  }

  private loadData() {
    this.checkForContact();
    this.loadProducts();
    this.loadSalesTypes();

    forkJoin([
      this.allProducts$,
      this.contacts$,
      this.allSalesTypes$
    ]).subscribe(([allProducts, contacts, salesTypes]) => {
      this.handleProductsResponse(allProducts);
      this.handleContactsResponse(contacts),
      this.handleSalesTypesResponse(salesTypes);
      this.showForm();
    },
      (err) => this.handleDataLoadError(err)
    );
  }

  private showForm() {
    this.loading = false;
  }

  private checkForContact() {
    if (this.contact) {
      this.addingForContact = true;
    }

    this.loadContacts();
  }

  private loadProducts() {
    this.allProducts$ = this.productService.fetchAllProducts();
  }

  private loadDealStages(salesType: string) {
    this.dealService.fetchDealStagesBySalesType(salesType).subscribe(
      (dealStages: DealStage[]) => this.handleDealStagesResponse(dealStages),
      err => this.handleDealStagesError(err));
  }

  private handleDealStagesError(err: Error) {
    console.error(err);
    this.alertService.error("Problem loading deal stages!");
  }

  private handleDealStagesResponse(dealStages: DealStage[]) {
    if (dealStages) {
      this.availableDealStages = dealStages;

      if (this.deal.stage) {
        this.dealFormGroup.get('stage').setValue(this.deal.stage.id);
        this.dealFormGroup.get('salesType').setValue(this.deal.stage.salesType);
      }

      this.showDealStagesDropdown = true;
    } else {
      this.alertService.error("Problem retrieving deal stages!");
    }
  }

  private loadSalesTypes() {
    this.allSalesTypes$ = this.dealService.fetchAllSalesTypes();
  }

  private handleSalesTypesResponse(salesTypes: SalesType[]) {
    this.availableSalesTypes = salesTypes;
  }

  private handleProductsResponse(products: Product[]) {
    this.availableProducts = products;
  }

  private handleContactsResponse(contacts: Contact[]) {
    this.contacts = contacts;

    if (this.addingForContact) {
      //adding
      this.contact = this.contacts.find(contact => this.contact.id === contact.id);
      this.dealFormGroup.controls['contact'].setValue(this.contact.id);
    } else if (this.deal.contact) {
      //editing
      this.contact = this.contacts.find(contact => this.deal.contact.id === contact.id);
    }
  }

  private handleDataLoadError(err: Error) {
    console.error(err);
    this.alertService.error("Problem loading supporting data")
  }

  private loadContacts() {
    this.contacts$ = this.contactService.fetchMyContacts();
  }

  private createForm() {
    this.dealFormGroup = this.fb.group({
      'name': [this.deal.name, [Validators.required, Validators.pattern('^[a-zA-Z0-9,.\' \-\]*$')]],
      'description': [this.deal.description, [Validators.pattern('^[a-zA-Z0-9,.\' \-\]*$')]],
      'units': [this.deal.units, [Validators.required, Validators.pattern('^\\d*$')]],
      'closureDate': [null, [this.closureDateValidator()]],
      'contact': [(this.deal.contact) ? this.deal.contact.id : '', [Validators.required]],
      'product': [(this.deal.product) ? this.deal.product.id : '', [Validators.required]],
      'stage': [(this.deal.stage) ? this.deal.stage.id : ''],
      'salesType': ['']
    });
  }

  private closureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      this.closureDateChanged();

      if (!control.value || control.value.toString().trim() == '') {
        return { 'invalid': true };
      } else {
        let today: number = Date.now();
        let difference = Math.abs(today - this.currentClosureDate);
        if (difference > maximumTimeSpan) {
          return { 'threshold': true };
        }
      }

      return null;
    };
  }

  private setCalendarInputs() {
    let currentDate = new Date();
    currentDate.setTime(this.currentClosureDate);
  }

  contactChanged(id: string) {
    if (this.contacts && id) {
      this.contact = this.contacts.find(contact => contact.id === id);
    }
  }

  closureDateChanged() {
    if (this.dealFormGroup) {
      let date: string = this.dealFormGroup.controls['closureDate'].value;
      let newDateVal: number = this.dateService.getDateVal(date);

      this.currentClosureDate = newDateVal;
    }
  }

  saveDeal() {
    this.saving = true;
    this.alertService.clear();

    //force all fields to validate one more time just to be sure
    Object.keys(this.dealFormGroup.controls).forEach(field => {
      let control = this.dealFormGroup.get(field);
      control.updateValueAndValidity();
    });

    if (this.formService.formHasErrors(this.dealFormGroup)) {
      this.alertService.error("Form contains errors. See below.");
      this.scrollToTop();
      this.saving = false;
    } else {
      this.setDeal();

      //console.log("Deal is ", this.deal);

      if (!this.deal.id) {
        this.dealService.createDeal(this.deal).subscribe(
          (deal: Deal) => this.handleDealSaveResponse(deal),
          err => this.handleDealSaveError(err)
        );
      } else {
        this.dealService.updateDeal(this.deal).subscribe(
          (deal: Deal) => this.handleDealSaveResponse(deal),
          err => this.handleDealSaveError(err)
        );
      }
    }
  }

  private handleDealSaveResponse(deal: Deal) {
    this.saving = false;
    this.alertService.success("Deal successfully saved!", { keepAfterRouteChange: true });
    let route = '/deals/view-deal';
    this.router.navigate([route], { queryParams: { dealId: deal.id } });
  }

  private handleDealSaveError(err: Error) {
    this.alertService.error("There was a problem. Please call support.");
    this.scrollToTop();

    console.error(err);

    this.saving = false;
  }

  private setDeal() {
    let user = this.userService.user;
    let salesOwner: SalesOwnerLightweight = { id: user.id, firstName: user.firstName, lastName: user.lastName, username: user.username }
    let account: AccountLightweight = { id: this.contact.account.id, name: this.contact.account.name, country: 'US' };
    let contact: ContactLightweight = { id: this.contact.id, firstName: this.contact.firstName, lastName: this.contact.lastName, account: account, salesOwner: salesOwner };
    let stage: DealStage = this.availableDealStages.find(st => st.id == this.dealFormGroup.controls['stage'].value);

    this.deal.contact = contact;
    this.deal.stage = stage;
    this.deal.expectedClosureDate = this.currentClosureDate;
    this.deal.name = this.dealFormGroup.controls['name'].value;
    this.deal.description = this.dealFormGroup.controls['description'].value;
    this.deal.product = this.currentProduct;
    this.deal.units = this.dealFormGroup.controls['units'].value;
  }

  private scrollToTop() {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
  }

  productSelected() {
    this.currentProduct = this.availableProducts.find(pr => pr.id == this.dealFormGroup.controls['product'].value);
  }

  salesTypeSelected(code: string) {
    this.loadDealStages(code);
  }

  onUnitChange(unitValue: string) {
    let units: number = Number(unitValue);

    if (!isNaN(units)) {
      if (units > 0) this.showTotalAmount = true;
    } else {
      this.showTotalAmount = false;
    }
  }
}
