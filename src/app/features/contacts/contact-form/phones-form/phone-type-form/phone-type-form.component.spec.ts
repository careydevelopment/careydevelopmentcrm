import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneTypeFormComponent } from './phone-type-form.component';

describe('PhoneTypeFormComponent', () => {
  let component: PhoneTypeFormComponent;
  let fixture: ComponentFixture<PhoneTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
