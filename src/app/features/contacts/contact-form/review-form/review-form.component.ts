import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../models/contact';

@Component({
  selector: 'contact-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {

  @Input() contact: Contact;
  @Input() errorMessages: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }


}
