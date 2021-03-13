import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contact } from '../../models/contact';
import { ReviewFormComponent } from './review-form.component';

describe('ReviewFormComponent', () => {
  let component: ReviewFormComponent;
  let fixture: ComponentFixture<ReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ReviewFormComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    
    //TODO: need to find a way to get the contact info in
    let contact: Contact = {} as Contact;
    component.contact = contact;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
