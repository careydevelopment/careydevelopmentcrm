import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sources } from '../../constants/source';
import { contactStatuses } from '../../constants/contact-status';
import { linesOfBusiness } from '../../constants/line-of-business';
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
      'firstName': ['Luke', [Validators.required, Validators.pattern('[A-Za-z \-\_]+')]],
      'lastName': ['Skywalker', [Validators.required, Validators.pattern('[A-Za-z \-\_]+')]],
      'email': ['luke@tatooine.com', {
        validators: Validators.compose([Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
      }],
      'source': ['EMAIL', [Validators.required]],
      'sourceDetails': ['He emailed me', [Validators.pattern('[A-Za-z0-9 \-\_]+')]],
      'status': ['NEW', [Validators.required]],
      'lineOfBusiness': ['ANGULAR'],
      'authority': ['false'],
      'title': ['President', [Validators.pattern('[A-Za-z\-\_]+')]],
      'company': ['International Business Machines', [Validators.pattern('[A-Za-z0-9 \-\_]+')]]
    });
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
