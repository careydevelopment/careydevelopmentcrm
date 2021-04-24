import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AlertService } from 'carey-alert';
import { RouterTestingModule } from '@angular/router/testing';
import { RecentActivitiesByContactComponent } from './recent-activities-by-contact.component';

describe('ActivitiesByContactComponent', () => {
  let component: RecentActivitiesByContactComponent;
  let fixture: ComponentFixture<RecentActivitiesByContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentActivitiesByContactComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        AlertService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentActivitiesByContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
