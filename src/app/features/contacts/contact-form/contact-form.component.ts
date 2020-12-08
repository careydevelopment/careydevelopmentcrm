import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../models/user';
import { AlertService } from '../../../ui/alert/alert.service';
import { UserService } from '../../service/user.service';
import { Contact } from '../models/contact';
import { SalesOwner } from '../models/sales-owner';
import { AddressesFormComponent } from './addresses-form/addresses-form.component';
import { BasicInfoFormComponent } from './basic-info-form/basic-info-form.component';
import { PhonesFormComponent } from './phones-form/phones-form.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit, AfterViewInit {

  isLinear = false;
  errorMessages: string[] = [];

  @ViewChild(BasicInfoFormComponent) basicInfoComponent: BasicInfoFormComponent;
  @ViewChild(AddressesFormComponent) addressesComponent: AddressesFormComponent;
  @ViewChild(PhonesFormComponent) phonesComponent: PhonesFormComponent;

  constructor(private alertService: AlertService, private userService: UserService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  saveInfo() {
    this.errorMessages = [];

    if (this.allFormsValid()) {
      let contact: Contact = this.createContact();
    }
  }

  private createContact(): Contact {
    let contact = {} as Contact;

    this.basicInfoComponent.populateContact(contact);
    this.addressesComponent.populateContact(contact);
    this.phonesComponent.populateContact(contact);

    console.log(contact);

    return contact;
  }

  private allFormsValid(): boolean {
    let basicInfoValid: boolean = this.basicInfoComponent.validForm();

    if (!basicInfoValid) {
      this.errorMessages.push("Basic Info form is invalid");
    }

    return basicInfoValid;
  }
}
