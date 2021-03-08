import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsByContactComponent } from './deals-by-contact.component';

describe('DealsByContactComponent', () => {
  let component: DealsByContactComponent;
  let fixture: ComponentFixture<DealsByContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealsByContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsByContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
