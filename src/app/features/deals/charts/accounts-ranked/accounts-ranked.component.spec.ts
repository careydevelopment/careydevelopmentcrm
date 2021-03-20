import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsRankedComponent } from './accounts-ranked.component';

describe('AccountsRankedComponent', () => {
  let component: AccountsRankedComponent;
  let fixture: ComponentFixture<AccountsRankedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsRankedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsRankedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
