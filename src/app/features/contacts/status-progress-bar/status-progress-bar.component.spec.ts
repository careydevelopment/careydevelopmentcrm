import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { StatusProgressBarComponent } from './status-progress-bar.component';
import { AlertService } from 'carey-alert';

describe('StatusProgressBarComponent', () => {
  let component: StatusProgressBarComponent;
  let fixture: ComponentFixture<StatusProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusProgressBarComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AlertService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
