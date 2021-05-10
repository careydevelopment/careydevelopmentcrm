import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'carey-alert';

import { AddDealComponent } from './add-deal.component';

describe('AddDealComponent', () => {
  let component: AddDealComponent;
  let fixture: ComponentFixture<AddDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDealComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [AlertService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
