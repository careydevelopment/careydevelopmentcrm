import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContactMenuComponent } from './view-contact-menu.component';

describe('ViewContactMenuComponent', () => {
  let component: ViewContactMenuComponent;
  let fixture: ComponentFixture<ViewContactMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContactMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContactMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
