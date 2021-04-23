import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertService } from '../../ui/alert/alert.service';

@Component({
  selector: 'app-dashboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
