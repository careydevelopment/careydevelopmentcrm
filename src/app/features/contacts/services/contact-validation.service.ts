import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { FormGroup } from '@angular/forms';
import { BasicInfoFormComponent } from '../contact-form/basic-info-form/basic-info-form.component';
import { ValidationService } from 'carey-validation';

@Injectable({ providedIn: 'root' })
export class ContactValidationService {

  constructor(private validationService: ValidationService) {}

  public validateForms(basicInfoComponent: BasicInfoFormComponent, contact: Contact): string[] {
    let errorMessages: string[] = [];

    errorMessages = errorMessages.concat(this.validateBasicInfoForm(basicInfoComponent));

    this.handleAdditionalValidations(errorMessages, contact);

    return errorMessages;
  }

  private handleAdditionalValidations(errorMessages: string[], contact: Contact) {
    this.validateAtLeastOneContactMethod(contact, errorMessages);
  }

  private validateBasicInfoForm(basicInfoComponent: BasicInfoFormComponent): string[] {
    let basicInfoForm: FormGroup = basicInfoComponent.basicInfoFormGroup;

    let errorMessages: string[] = this.validationService.validateForm(basicInfoForm);

    return errorMessages;
  }

  private validateAtLeastOneContactMethod(contact: Contact, errorMessages: string[]) {
    if (!contact.email
      && (!contact.addresses || contact.addresses.length == 0)
      && (!contact.phones || contact.phones.length == 0)) {

      errorMessages.push("Please include at least one method of contact (phone, email, address)");
    }
  }
}
