import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountsComponent } from './view-accounts.component';

describe('ViewAccountsComponent', () => {
  let component: ViewAccountsComponent;
  let fixture: ComponentFixture<ViewAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
