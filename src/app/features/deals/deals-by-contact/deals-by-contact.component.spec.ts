import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DealsByContactComponent } from './deals-by-contact.component';

describe('DealsByContactComponent', () => {
  let component: DealsByContactComponent;
  let fixture: ComponentFixture<DealsByContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DealsByContactComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
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
