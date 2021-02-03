import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivitiesByContactComponent } from './recent-activities-by-contact.component';

describe('ActivitiesByContactComponent', () => {
  let component: RecentActivitiesByContactComponent;
  let fixture: ComponentFixture<RecentActivitiesByContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentActivitiesByContactComponent ]
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
