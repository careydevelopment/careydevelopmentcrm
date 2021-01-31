import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlertService } from '../../../ui/alert/alert.service';
import { ContactService } from '../../service/contact.service';
import { Account } from '../models/account';
import { Contact } from '../models/contact';
import { AddressesFormComponent } from './addresses-form/addresses-form.component';
import { BasicInfoFormComponent } from './basic-info-form/basic-info-form.component';
import { PhonesFormComponent } from './phones-form/phones-form.component';

const BASIC_INFO_INDEX: number = 0;
const ADDRESSES_INDEX: number = 1;
const PHONES_INDEX: number = 2;
const REVIEW_INDEX: number = 3;

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit, AfterViewInit, OnDestroy {

  errorMessages: string[] = [];
  currentStepIndex: number = 0;
  basicInfoFormSubscription: Subscription;
  formSubmitted: boolean = false;
  allFormsValid: boolean = false;
  pageTitle: string = 'Add Contact';
  accounts: Account[];

  @ViewChild(BasicInfoFormComponent) basicInfoComponent: BasicInfoFormComponent;
  @ViewChild(AddressesFormComponent) addressesComponent: AddressesFormComponent;
  @ViewChild(PhonesFormComponent) phonesComponent: PhonesFormComponent;

  @Input() contact: Contact;

  constructor(private alertService: AlertService, private contactService: ContactService) { }

  ngOnInit() {
    if (!this.contact) {
      this.contact = {} as Contact;
    } else {
      this.setPageTitle();
    }
  }

  ngOnDestroy() {
    this.basicInfoFormSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    //gotta do this here so we have a handle on the child components
    this.handleSubscriptions();
  }

  private setPageTitle() {
    this.pageTitle = `Edit Contact ${this.contact.firstName} ${this.contact.lastName}`;
  }

  private handleSubscriptions() {
    this.handleBasicInfoFormSubscription();
  }

  private handleBasicInfoFormSubscription() {
    //tracks changes to the form
    //if the form becomes invalid, this will light the icon button red
    //if the invalid form becomes valid, it will turn the icon button to original color
    this.basicInfoFormSubscription = this.basicInfoComponent
      .basicInfoFormGroup
      .valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(
        (values) => {
          this.handleFormCheck();
        }
      );
  }

  private handleFormCheck() {
    this.handleBasicInfoFormCheck();
  }

  private handleBasicInfoFormCheck() {
    if (this.currentStepIndex == BASIC_INFO_INDEX) {
      if (this.basicInfoComponent.basicInfoFormGroup.valid) {
        this.clearIconError(BASIC_INFO_INDEX);
      }   
    }
  }

  onStepChange(event: any) {
    let previousIndex: number = event.previouslySelectedIndex;
    let currentIndex: number = event.selectedIndex;

    this.currentStepIndex = currentIndex;

    if (previousIndex == BASIC_INFO_INDEX) {
      this.basicInfoComponent.populateContact(this.contact);

      let validForm: boolean = (this.basicInfoComponent.basicInfoFormGroup.valid);
      if (!validForm) {
        this.changeIcon(previousIndex);
        this.allFormsValid = false;
      } else {
        this.clearIconError(previousIndex);
        this.allFormsValid = true;
      }
    } else if (previousIndex == ADDRESSES_INDEX) {
      this.addressesComponent.populateContact(this.contact);
    } else if (previousIndex == PHONES_INDEX) {
      this.phonesComponent.populateContact(this.contact);
    }

    if (currentIndex == REVIEW_INDEX) {
      this.validateForms();
    }
  }

  private clearIconError(index: number) {
    let iconElement: HTMLElement = this.getIconElementByIndex(index);
    iconElement.classList.remove('mat-step-icon-invalid');
  }

  private changeIcon(index: number) {
    let iconElement: HTMLElement = this.getIconElementByIndex(index);
    iconElement.classList.add('mat-step-icon-invalid');
  }

  private getIconElementByIndex(index: number): HTMLElement {
    let nodeList: NodeList = document.querySelectorAll('.mat-step-icon');
    let node: Node = nodeList.item(index);

    return (<HTMLElement>node);
  }

  private validateForms() {    
    this.errorMessages = [];

    this.validateBasicInfoForm();
    this.validateAtLeastOneContactMethod();
  }

  private validateBasicInfoForm() {
    let basicInfoForm: FormGroup = this.basicInfoComponent.basicInfoFormGroup;

    Object.keys(basicInfoForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = basicInfoForm.get(key).errors;
      if (controlErrors != null) {
        this.addErrorByKey(key);    
      }
    });
  }

  private validateAtLeastOneContactMethod() {
    if (!this.contact.email
      && (!this.contact.addresses || this.contact.addresses.length == 0)
      && (!this.contact.phones || this.contact.phones.length == 0)) {

        this.errorMessages.push("Please include at least one method of contact (phone, email, address)")
    }
  }

  private addErrorByKey(key: string) {
    if (key == 'firstName') this.errorMessages.push("Please enter a valid first name");
    if (key == 'lastName') this.errorMessages.push("Please enter a valid last name");
    if (key == 'source') this.errorMessages.push("Please select a source");
    if (key == 'status') this.errorMessages.push("Please select a status");
  }

  saveInfo() {
    this.alertService.clear();
    this.formSubmitted = true;

    if (!this.contact.id) this.createContact();
    else this.updateContact();
  }

  private updateContact() {
    this.contactService.update(this.contact)
      .subscribe(
        (contact: Contact) => this.handleContactSaveResponse(contact),
        err => this.handleContactSaveError(err)
      );
  }

  private createContact() {
    this.contactService.create(this.contact)
      .subscribe(
        (contact: Contact) => this.handleContactSaveResponse(contact),
        err => this.handleContactSaveError(err)
      );
  }

  private handleContactSaveResponse(contact: Contact) {
    this.contact = contact;
    this.formSubmitted = false;
    this.alertService.success("Contact successfully saved!");
    this.setPageTitle();
    this.scrollToTop();
  }

  private handleContactSaveError(err) {
    console.error(err);
    this.formSubmitted = false;
    this.alertService.error("There was a problem - please contact support");
    this.scrollToTop();
  }

  private scrollToTop() {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
  }
}
