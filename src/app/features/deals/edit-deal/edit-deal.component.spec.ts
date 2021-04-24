import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'carey-alert';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';

import { EditDealComponent } from './edit-deal.component';

describe('EditDealComponent', () => {
  let component: EditDealComponent;
  let fixture: ComponentFixture<EditDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDealComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        AlertService,
        BreadcrumbService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
