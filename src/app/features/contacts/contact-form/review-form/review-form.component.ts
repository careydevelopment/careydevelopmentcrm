import { Component, OnInit, Input } from '@angular/core';
import { DropdownOption } from '../../../ui/model/dropdown-option';
import { DropdownService } from '../../../ui/service/dropdown.service';
import { addressTypes } from '../../constants/address-type';
import { contactStatuses } from '../../constants/contact-status';
import { linesOfBusiness } from '../../constants/line-of-business';
import { phoneTypes } from '../../constants/phone-type';
import { sources } from '../../constants/source';
import { Contact } from '../../models/contact';

@Component({
  selector: 'contact-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {

  @Input() contact: Contact;
  @Input() errorMessages: string[] = [];

  availableAddressTypes: DropdownOption[] = addressTypes;
  availablePhoneTypes: DropdownOption[] = phoneTypes;
  availableContactStatuses: DropdownOption[] = contactStatuses;
  availableLinesOfBusiness: DropdownOption[] = linesOfBusiness;
  availableSources: DropdownOption[] = sources;

  constructor(private dropdownService: DropdownService) { }

  ngOnInit(): void {
  }

}
