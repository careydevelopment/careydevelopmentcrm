import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteMessageComponent } from './route-message.component';

describe('RouteMessageComponent', () => {
  let component: RouteMessageComponent;
  let fixture: ComponentFixture<RouteMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
