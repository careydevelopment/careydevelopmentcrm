import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDealsComponent } from './view-deals.component';

describe('ViewDealsComponent', () => {
  let component: ViewDealsComponent;
  let fixture: ComponentFixture<ViewDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
