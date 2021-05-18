import { Component, OnInit, Input } from '@angular/core';
import { addressTypes } from '../../../../models/address-type';
import { DisplayValueMap } from '../../../../models/name-value-map';
import { phoneTypes } from '../../../../models/phone-type';
import { sources } from '../../../../models/source';
import { DisplayValueMapService } from '../../../ui/service/display-map.service';
import { contactStatuses } from '../../constants/contact-status';
import { linesOfBusiness } from '../../constants/line-of-business';
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
