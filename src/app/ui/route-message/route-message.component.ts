import { Component, OnInit } from '@angular/core';
import { RouteMessageService } from './route-message.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'route-message',
  templateUrl: './route-message.component.html',
  styleUrls: ['./route-message.component.css']
})
export class RouteMessageComponent implements OnInit {

  currentMessage: string = null;

  constructor(private routeMessageService: RouteMessageService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.currentMessage = this.routeMessageService.message;
    if (this.currentMessage) this.alertService.info(this.currentMessage);
  }

}
