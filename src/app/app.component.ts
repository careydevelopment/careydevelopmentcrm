import { Component } from '@angular/core';
import { GeoService } from './services/geo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Carey Development CRM';

  constructor(private geoService: GeoService) {
    this.initializeCachedData();
  }    

  private initializeCachedData() {
    this.geoService.initializeAllStates();
    this.geoService.initializeAllCountries();
  }
}
