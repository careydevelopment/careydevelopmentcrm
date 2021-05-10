import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ActivityFormComponent } from './activity-form.component';
import { AlertService } from 'carey-alert';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Activity } from '../models/activity';
import { ActivityTypeLightweight } from '../models/activity-type-lightweight';
import { UserService, User } from 'carey-user';
import { ContactLightweight } from '../../activities/models/contact-lightweight';
import { SalesOwnerLightweight } from '../models/sales-owner-lightweight';
import { goodActivity } from '../../../../testing/activity-helper';
import { goodContact, goodContacts } from '../../../../testing/contact-helper';
import { ContactService } from '../../contacts/services/contact.service';

describe('ActivityFormComponent', () => {
  let component: ActivityFormComponent;
  let fixture: ComponentFixture<ActivityFormComponent>;

  const mockAlertService = jasmine.createSpyObj('AlertService', ['error']);
  const mockContactService = jasmine.createSpyObj('ContactService', ['fetchMyContacts']);

  const mockUserService = {
    user: { id: '3' } as User
  };

  beforeEach(async () => {
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
        {
          provide: ContactService,
          useValue: mockContactService
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

  it('Verify current dates with input activity', () => {
    component.activity = goodActivity;
    fixture.detectChanges();
    expect(component.currentEndDate).toEqual(goodActivity.endDate);
    expect(component.currentStartDate).toEqual(goodActivity.startDate);
  });

  it('Verify form dates with input activity', () => {
    component.activity = goodActivity;
    fixture.detectChanges();

    let form: FormGroup = component.activityFormGroup;
    let endDate = form.get('endDate').value;
    let startDate = form.get('startDate').value;

    expect(endDate).toEqual(new Date(goodActivity.endDate));
    expect(startDate).toEqual(new Date(goodActivity.startDate));
  });

  it('Verify addingForContact with input contact', () => {
    component.contact = goodContact;
    fixture.detectChanges();

    expect(component.addingForContact).toBeTruthy();
  });

  it('Verify contacts loaded', async(() => {
    mockContactService.fetchMyContacts.and.returnValue(goodContacts);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(mockContactService.fetchMyContacts).toHaveBeenCalled();
    });
  }));
});
