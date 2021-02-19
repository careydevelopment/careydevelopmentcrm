import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActivityComponent } from './view-activity.component';

describe('ViewActivityComponent', () => {
  let component: ViewActivityComponent;
  let fixture: ComponentFixture<ViewActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
