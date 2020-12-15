import { Injectable } from '@angular/core';
import { Country } from '../models/country';
import { State } from '../models/state';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

const baseUrl: string = environment.baseGeoServiceUrl;

@Injectable({ providedIn: 'root' })
export class GeoService {

  private _allCountries: Country[];
  private _allStates: State[];

  constructor(private http: HttpClient) { }

  get allCountries() {
    return this._allCountries;
  }

  get allStates() {
    return this._allStates;
  }

  initializeAllCountries(): Observable<Country[]> {
    console.log("Initializing");
    let countriesObservable$ = this.http.get<Country[]>(`${baseUrl}/countries`);

    return countriesObservable$.pipe(
      map(countries => {
        this._allCountries = countries;
        return countries;
      })
    )
  }

  initializeAllStates(): Observable<State[]> {
    let statesObservable$ = this.http.get<State[]>(`${baseUrl}/states`);

    return statesObservable$.pipe(
      map(states => {
        this._allStates = states;
        return states;
      })
    )
  }

  private handleError(error: HttpErrorResponse) {
    console.error("Problem trying to retrieve geo array!", error);
  };

  findCountryCodeByTwoLetterAbbreviation(abbreviation: string): string {
    let code: string = null;

    if (!this.allCountries) {
      this.initializeAllCountries().subscribe(
        (countries: Country[]) => code = this.findCountryCode(abbreviation)
      )
    } else {
      code = this.findCountryCode(abbreviation);
    }

    return code;
  }

  private findCountryCode(abbreviation: string): string {
    let code = null;

    if (abbreviation && abbreviation.trim().length > 0) {
      for (let i = 0; i < this.allCountries.length; i++) {
        let country = this.allCountries[i];
        if (country.twoLetterCode.toUpperCase() == abbreviation.toUpperCase()) {
          code = country.countryCode;
          break;
        }
      }
    }

    console.log("Country code is " + code);
    return code;
  }
}
