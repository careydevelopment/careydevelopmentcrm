import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { JwtResponse } from '../models/jwt-response';
import { UrlService } from '../services/url.service';
import { UserService } from '../features/service/user.service';
import { AlertService } from '../ui/alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService,
    private router: Router, private route: ActivatedRoute, private urlService: UrlService,
    private userService: UserService, private alertService: AlertService) { }

  ngOnInit() {
    this.authenticationService.clearStorage();

    this.form = this.fb.group({
        'username': ['', Validators.compose([Validators.required])],
        'password': ['', Validators.compose([Validators.required])]
    });
  }

  onSubmit(loginForm) {
    this.alertService.clear();
    this.formSubmitted = true;

    if (this.form.valid) {
        let username = this.form.controls['username'].value;
        let password = this.form.controls['password'].value;

        let user$ = this.authenticationService.login(username, password);

      user$.subscribe(
        (jwtResponse: JwtResponse) => this.handleLoginResponse(jwtResponse),
        err => this.handleLoginError(err)
      );
    } else {
        this.formSubmitted = false;
    }
  }

  private handleLoginError(err: Error) {
    console.error(err);

    if (err instanceof HttpErrorResponse) {
      if (err.status == 401) this.alertService.error("Invalid credentials");
    } 

    this.formSubmitted = false;
  }

  private handleLoginResponse(jwtResponse: JwtResponse) {
    console.log(jwtResponse);

    if (jwtResponse && jwtResponse.token) {
      this.userService.user = jwtResponse.user;
      this.goToRoute();
    }

    this.formSubmitted = false;
  }

  private goToRoute() {
    let map: ParamMap = this.route.snapshot.queryParamMap;
    let returnUrl = map.get('returnUrl');
    let queryParams: any = {};

    if (returnUrl) {
        queryParams = this.urlService.getQueryParams(returnUrl);
        returnUrl = this.urlService.shortenUrlIfNecessary(returnUrl);
    } else {
        returnUrl = '/dashboard';
    }

    this.router.navigate([returnUrl], queryParams);
  }
}
