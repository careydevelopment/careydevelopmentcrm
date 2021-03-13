import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { AddressesFormComponent } from './addresses-form.component';

describe('AddressesFormComponent', () => {
  let component: AddressesFormComponent;
  let fixture: ComponentFixture<AddressesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressesFormComponent],
      imports: [],
      providers: [
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
