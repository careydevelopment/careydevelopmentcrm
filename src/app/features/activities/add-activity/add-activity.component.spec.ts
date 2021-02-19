import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityComponent } from './add-activity.component';

describe('AddActivityComponent', () => {
  let component: AddActivityComponent;
  let fixture: ComponentFixture<AddActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
