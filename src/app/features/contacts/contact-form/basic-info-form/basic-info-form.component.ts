import { Component, OnInit, Input } from '@angular/core';
import { ValidationErrors, FormGroup, AsyncValidatorFn, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { sources } from '../../constants/source';
import { contactStatuses } from '../../constants/contact-status';
import { linesOfBusiness } from '../../constants/line-of-business';
import { DropdownOption } from '../../../ui/model/dropdown-option'
import { Contact } from '../../models/contact';
import { Observable, of } from 'rxjs';
import { map, delay, switchMap } from 'rxjs/operators';
import { ContactService } from '../../../service/contact.service';

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

  @Input() contact: Contact;

  constructor(private fb: FormBuilder, private contactService: ContactService) { }

  ngOnInit() {
    this.basicInfoFormGroup = this.fb.group({
      'firstName': ['', [Validators.required, Validators.pattern('[A-Za-z \-\_]+')]],
      'lastName': ['', [Validators.required, Validators.pattern('[A-Za-z \-\_]+')]],
      'email': ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
        [this.emailExistsValidator()],
       'blur'
      ],
      'source': [null, [Validators.required]],
      'sourceDetails': ['', [Validators.pattern('[A-Za-z0-9 \-\_]+')]],
      'status': ['NEW', [Validators.required]],
      'lineOfBusiness': [null],
      'authority': ['false'],
      'title': ['', [Validators.pattern('[A-Za-z\-\_]+')]],
      'company': ['', [Validators.pattern('[A-Za-z0-9 \-\_]+')]]
    });
  }

  private emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value && (<string>control.value).trim().length > 0) {
        return of(control.value).pipe(
          delay(500),
          switchMap((email) => this.contactService.doesEmailExist(email).pipe(
            map(emailExists => emailExists ? { emailExists: true } : null)
          ))
        );
      } else {
        return of(null);
      }
    };
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
