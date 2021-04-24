import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'carey-alert';

import { ViewContactsComponent } from './view-contacts.component';

describe('ViewContactsComponent', () => {
  let component: ViewContactsComponent;
  let fixture: ComponentFixture<ViewContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewContactsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AlertService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
