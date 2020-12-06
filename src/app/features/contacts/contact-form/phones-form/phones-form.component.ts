import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownOption } from '../../../ui/model/dropdown-option'

@Component({
  selector: 'contact-phones-form',
  templateUrl: './phones-form.component.html',
  styleUrls: ['./phones-form.component.css']
})
export class PhonesFormComponent implements OnInit {

  isLinear = false;
  phonesFormGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.phonesFormGroup = this.fb.group({
      thirdCtrl: ['', Validators.required]
    });
  }
}
