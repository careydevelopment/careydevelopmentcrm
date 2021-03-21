import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
let map: Map<string, number> = new Map<string, number>();
map.set('john', 14);
map.set('judy', 15);
map.set('james', 16);
map.set('jane', 17);

  let lastValue: number = Array.from(map.values()).pop();
  console.log(lastValue);
  }

}
