import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFormComponent } from './account-form.component';

describe('AccountFormComponent', () => {
  let component: AccountFormComponent;
  let fixture: ComponentFixture<AccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
