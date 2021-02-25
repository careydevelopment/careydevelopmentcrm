import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusProgressBarComponent } from './status-progress-bar.component';

describe('StatusProgressBarComponent', () => {
  let component: StatusProgressBarComponent;
  let fixture: ComponentFixture<StatusProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusProgressBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
