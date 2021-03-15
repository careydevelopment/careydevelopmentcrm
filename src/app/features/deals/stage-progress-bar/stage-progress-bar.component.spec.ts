import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageProgressBarComponent } from './stage-progress-bar.component';

describe('StageProgressBarComponent', () => {
  let component: StageProgressBarComponent;
  let fixture: ComponentFixture<StageProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageProgressBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StageProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
