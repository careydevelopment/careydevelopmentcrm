import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { sources } from '../../constants/source';
import { contactStatuses } from '../../constants/contact-status';
import { linesOfBusiness } from '../../constants/line-of-business';
import { DropdownOption } from '../../ui/model/dropdown-option'

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  isLinear = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
