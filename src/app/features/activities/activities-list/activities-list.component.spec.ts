import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesListComponent } from './activities-list.component';

describe('ActivitiesListComponent', () => {
  let component: ActivitiesListComponent;
  let fixture: ComponentFixture<ActivitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
