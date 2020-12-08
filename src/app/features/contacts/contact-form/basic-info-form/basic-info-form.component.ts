import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sources } from '../../../constants/source';
import { contactStatuses } from '../../../constants/contact-status';
import { linesOfBusiness } from '../../../constants/line-of-business';
import { DropdownOption } from '../../../ui/model/dropdown-option'
import { Contact } from '../../models/contact';

@Component({
  selector: 'contact-basic-info-form',
  templateUrl: './basic-info-form.component.html',
  styleUrls: ['./basic-info-form.component.css']
})
export class BasicInfoFormComponent implements OnInit {

  basicInfoFormGroup: FormGroup;

  availableSources: DropdownOption[] = sources;
  availableContactStatuses: DropdownOption[] = contactStatuses;
  availableLinesOfBusiness: DropdownOption[] = linesOfBusiness;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.basicInfoFormGroup = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', {
        validators: Validators.compose([Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
      }],
      'source': ['', [Validators.required]],
      'sourceDetails': [''],
      'status': ['NEW', [Validators.required]],
      'lineOfBusiness': [''],
      'authority': ['false'],
      'title': [''],
      'company': ['']
    });
  }

  validForm(): boolean {
    return this.basicInfoFormGroup.valid;
  }

  populateContact(contact: Contact) {
    let basicInfo: FormGroup = this.basicInfoFormGroup;

    contact.authority = (basicInfo.controls['authority'].value == 'true');
    contact.company = basicInfo.controls['company'].value.trim();
    contact.email = basicInfo.controls['email'].value.trim();
    contact.firstName = basicInfo.controls['firstName'].value.trim();
    contact.lastName = basicInfo.controls['lastName'].value.trim();
    contact.linesOfBusiness = [basicInfo.controls['lineOfBusiness'].value];
    contact.source = basicInfo.controls['source'].value;
    contact.sourceDetails = basicInfo.controls['sourceDetails'].value.trim();
    contact.status = basicInfo.controls['status'].value;
    contact.title = basicInfo.controls['title'].value.trim();
  }
}
