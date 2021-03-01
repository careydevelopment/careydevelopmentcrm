import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Contact } from '../../contacts/models/contact';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../ui/alert/alert.service';
import { ContactService } from '../../service/contact.service';
import { ValidatorFn, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Deal } from '../models/deal';
import { Product } from '../models/product';
import { DealStage } from '../models/deal-stage';
import { DateService } from '../../../services/date.service';
import { FormService } from '../../../services/form.service';
import { AccountLightweight } from '../models/account-lightweight';
import { ContactLightweight } from '../models/contact-lightweight';
import { Observable, forkJoin } from 'rxjs';
import { UserService } from '../../service/user.service';
import { SalesOwnerLightweight } from '../models/sales-owner-lightweight';
import { DealService } from '../service/deal.service';
import { ProductService } from '../service/product.service';

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

  availableProducts: Product[] = [this.loadingProduct];
  availableDealStages: DealStage[] = [];

  saving: boolean = false;
  loading: boolean = true;

  prohibitedEdit: boolean = false;

  allProducts$: Observable<Product[]>;
  contacts$: Observable<Contact[]>;
  allDealStages$: Observable<DealStage[]>;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private fb: FormBuilder,
    private dealService: DealService, private dateService: DateService,
    private formService: FormService, private userService: UserService,
    private productService: ProductService) { }

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
    this.loadDealStages();

    forkJoin([
      this.allProducts$,
      this.contacts$,
      this.allDealStages$
    ]).subscribe(([allProducts, contacts, dealStages]) => {
      this.handleProductsResponse(allProducts);
      this.handleContactsResponse(contacts),
      this.handleDealStagesResponse(dealStages),
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

  private loadDealStages() {
    this.allDealStages$ = this.dealService.fetchAllDealStages();
  }

  private handleProductsResponse(products: Product[]) {
    this.availableProducts = products;
  }

  private handleContactsResponse(contacts: Contact[]) {
    this.contacts = contacts;

    if (this.deal.contact) {
      //editing
      this.contact = this.contacts.find(contact => this.deal.contact.id === contact.id);
    }
  }

  private handleDealStagesResponse(dealStages: DealStage[]) {
    this.availableDealStages = dealStages;
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
      'units': [this.deal.units, [Validators.required]],
      'closureDate': [null, [this.closureDateValidator()]],
      'contact': [(this.deal.contact) ? this.deal.contact.id : '', [Validators.required]],
      'product': [(this.deal.product) ? this.deal.product.id : '', [Validators.required]],
      'stage': [(this.deal.stage) ? this.deal.stage.id : '']
    });
  }

  private closureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      this.closureDateChanged();
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
      let newDateVal: number = this.dateService.getDateVal(date, 0, 0, 'AM');

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
    console.log("got back", deal);
    this.alertService.success("Deal successfully saved!");
    this.deal = deal;
    this.scrollToTop();
    this.saving = false;
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
    let product: Product = { id: this.selectedProduct.id, name: this.selectedProduct.name, description: this.selectedProduct.description, productType: this.selectedProduct.productType, lineOfBusiness: this.selectedProduct.lineOfBusiness, prices: this.selectedProduct.prices };
    let stage: DealStage = this.availableDealStages.find(st => st.id == this.dealFormGroup.controls['stage'].value);

    this.deal.contact = contact;
    this.deal.stage = stage;
    this.deal.expectedClosureDate = this.currentClosureDate;
    this.deal.name = this.dealFormGroup.controls['name'].value;
    this.deal.description = this.dealFormGroup.controls['description'].value;
    this.deal.product = product;
    this.deal.units = this.dealFormGroup.controls['units'].value;
  }

  private scrollToTop() {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
  }
}
