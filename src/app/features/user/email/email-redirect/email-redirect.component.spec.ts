import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRedirectComponent } from './email-redirect.component';

describe('EmailRedirectComponent', () => {
  let component: EmailRedirectComponent;
  let fixture: ComponentFixture<EmailRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
