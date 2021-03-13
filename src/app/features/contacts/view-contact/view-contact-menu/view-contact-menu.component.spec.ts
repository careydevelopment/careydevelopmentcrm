import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewContactMenuComponent } from './view-contact-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';

describe('ViewContactMenuComponent', () => {
  let component: ViewContactMenuComponent;
  let fixture: ComponentFixture<ViewContactMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewContactMenuComponent],
      imports: [
        RouterTestingModule,
        MatMenuModule
      ],
      providers: [
      ]
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
