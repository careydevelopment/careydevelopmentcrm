import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { AlertService } from '../../../ui/alert/alert.service';
import { UserService } from '../../service/user.service';
import { Contact } from '../models/contact';
import { AddressesFormComponent } from './addresses-form/addresses-form.component';
import { BasicInfoFormComponent } from './basic-info-form/basic-info-form.component';
import { PhonesFormComponent } from './phones-form/phones-form.component';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  errorMessages: string[] = [];
  contact: Contact = {} as Contact;

  @ViewChild(BasicInfoFormComponent) basicInfoComponent: BasicInfoFormComponent;
  @ViewChild(AddressesFormComponent) addressesComponent: AddressesFormComponent;
  @ViewChild(PhonesFormComponent) phonesComponent: PhonesFormComponent;

  constructor(private alertService: AlertService, private userService: UserService) { }

  ngOnInit() {
  }

  onStepChange(event: any) {
    let previousLabel: string = event.previouslySelectedStep.label;
    let currentLabel: string = event.selectedStep.label;

    if (previousLabel == 'Basic Info') {
      this.basicInfoComponent.populateContact(this.contact);
    } else if (previousLabel == 'Addresses') {
      this.addressesComponent.populateContact(this.contact);
    } else if (previousLabel == 'Phones') {
      this.phonesComponent.populateContact(this.contact);
    }

    if (currentLabel == 'Review & Save') {
      this.validateForms();
    }
  }

  validateForms() {
    this.errorMessages = [];

    this.validateBasicInfoForm();
    this.validateAtLeastOneContactMethod();
  }

  validateBasicInfoForm() {
    let basicInfoForm: FormGroup = this.basicInfoComponent.basicInfoFormGroup;

    Object.keys(basicInfoForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = basicInfoForm.get(key).errors;
      if (controlErrors != null) {
        this.addErrorByKey(key);    
      }
    });
  }

  validateAtLeastOneContactMethod() {
    if (!this.contact.email
      && (!this.contact.addresses || this.contact.addresses.length == 0)
      && (!this.contact.phones || this.contact.phones.length == 0)) {

      this.errorMessages.push("Please include at least one method of contact (phone, email, address)")
    }
  }

  addErrorByKey(key: string) {
    if (key == 'firstName') this.errorMessages.push("Please enter a valid first name");
    if (key == 'lastName') this.errorMessages.push("Please enter a valid last name");
    if (key == 'source') this.errorMessages.push("Please select a source");
  }

  saveInfo() {
    this.createContact();
  }

  private createContact() {
    console.log(this.contact);
  }

}
