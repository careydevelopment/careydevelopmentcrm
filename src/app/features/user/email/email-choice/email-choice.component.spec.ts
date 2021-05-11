import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailChoiceComponent } from './email-choice.component';

describe('EmailChoiceComponent', () => {
  let component: EmailChoiceComponent;
  let fixture: ComponentFixture<EmailChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
