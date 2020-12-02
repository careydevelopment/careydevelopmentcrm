import { Injectable } from '@angular/core';
import { Country } from '../models/country';
import { State } from '../models/state';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

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

  initializeAllCountries() {
    let countriesObservable$ = this.http.get<Country[]>("http://localhost:8080/utilities/countries", httpOptions);

    countriesObservable$.subscribe(
      (countries: Country[]) => this.handleResponseForCountries(countries),
      err => this.handleError(err)
    );
  }

  initializeAllStates() {
    let statesObservable$ = this.http.get<State[]>("http://localhost:8080/utilities/states", httpOptions);

    statesObservable$.subscribe(
      (states: State[]) => this.handleResponseForStates(states),
      err => this.handleError(err)
    );
  }

  private handleResponseForStates(states: State[]) {
    this._allStates = states;
  }

  private handleResponseForCountries(countries: Country[]) {
    this._allCountries = countries;
  }

  private handleError(error: HttpErrorResponse) {
    console.error("Problem trying to retrieve geo array!", error);
  };
}
