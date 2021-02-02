import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesByContactComponent } from './activities-by-contact.component';

describe('ActivitiesByContactComponent', () => {
  let component: ActivitiesByContactComponent;
  let fixture: ComponentFixture<ActivitiesByContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesByContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesByContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
