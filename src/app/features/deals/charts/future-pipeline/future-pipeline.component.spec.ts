import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturePipelineComponent } from './future-pipeline.component';

describe('FuturePipelineComponent', () => {
  let component: FuturePipelineComponent;
  let fixture: ComponentFixture<FuturePipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuturePipelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuturePipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
