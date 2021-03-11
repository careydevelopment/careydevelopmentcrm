import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ActivityFormComponent } from './activity-form.component';
import { AlertService } from '../../../ui/alert/alert.service';
import { FormBuilder } from '@angular/forms';
import { Activity } from '../models/activity';
import { ChangeDetectionStrategy } from '@angular/core';
import { ActivityTypeLightweight } from '../models/activity-type-lightweight';
import { UserService } from '../../service/user.service';
import { User } from '../../../models/user';
import { SalesOwner } from '../../contacts/models/sales-owner';
import { ContactLightweight } from '../../activities/models/contact-lightweight';
import { SalesOwnerLightweight } from '../models/sales-owner-lightweight';
import { goodActivity } from '../testing/activity-helper';

describe('ActivityFormComponent', () => {
  let component: ActivityFormComponent;
  let fixture: ComponentFixture<ActivityFormComponent>;

  const mockAlertService = jasmine.createSpyObj('AlertService', ['error']);

  let mockUserService;

  beforeEach(async () => {
    mockUserService = {
      user: { id: '3' } as User
    }

    await TestBed.configureTestingModule({
      declarations: [ActivityFormComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: AlertService,
          useValue: mockAlertService
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Verify page title with input activity', () => {
    component.activity = goodActivity;
    fixture.detectChanges();
    expect(component.pageTitle).toEqual('Edit Activity');
  });

  it('Verify page title with no input activity', () => {
    fixture.detectChanges();
    expect(component.pageTitle).toEqual('Add Activity');
  });

  it('Verify error on non-user activity type', () => {
    let activityType = { activityTypeCreator: 'SYSTEM' } as ActivityTypeLightweight;
    let activity: Activity = goodActivity;
    activity.type = activityType;
    component.activity = activity;

    fixture.detectChanges();

    expect(mockAlertService.error).toHaveBeenCalled();
    expect(component.prohibitedEdit).toBeTruthy();
  });

  it('Verify error on invalid sales owner', () => {
    let salesOwner = { id: '4' } as SalesOwnerLightweight;
    let contact = { id: '3', salesOwner: salesOwner } as ContactLightweight;
    let activity: Activity = goodActivity;
    activity.contact = contact;
    component.activity = activity;
    fixture.detectChanges();

    expect(mockAlertService.error).toHaveBeenCalled();
    expect(component.prohibitedEdit).toBeTruthy();
  });

});
