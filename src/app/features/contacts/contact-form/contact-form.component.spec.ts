import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from 'carey-alert';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactFormComponent } from './contact-form.component';
import { AddressesFormComponent } from './addresses-form/addresses-form.component';
import { BasicInfoFormComponent } from './basic-info-form/basic-info-form.component';
import { PhonesFormComponent } from './phones-form/phones-form.component';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ContactFormComponent,
        AddressesFormComponent,
        BasicInfoFormComponent,
        PhonesFormComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule
      ],
      providers: [
        AlertService,
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
