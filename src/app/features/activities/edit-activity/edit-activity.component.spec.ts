import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AlertService } from 'carey-alert';
import { FormBuilder } from '@angular/forms';
import { EditActivityComponent } from './edit-activity.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';

describe('EditActivityComponent', () => {
  let component: EditActivityComponent;
  let fixture: ComponentFixture<EditActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditActivityComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        AlertService,
        FormBuilder,
        BreadcrumbService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
