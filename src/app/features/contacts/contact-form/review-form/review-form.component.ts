import { Component, OnInit, Input } from '@angular/core';
import { DisplayValueMap } from '../../../../models/name-value-map';
import { DisplayValueMapService } from '../../../ui/service/display-map.service';
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

  availableAddressTypes: DisplayValueMap[] = addressTypes;
  availablePhoneTypes: DisplayValueMap[] = phoneTypes;
  availableContactStatuses: DisplayValueMap[] = contactStatuses;
  availableLinesOfBusiness: DisplayValueMap[] = linesOfBusiness;
  availableSources: DisplayValueMap[] = sources;

  constructor(private displayValueMapService: DisplayValueMapService) { }

  ngOnInit(): void {
  }

}
