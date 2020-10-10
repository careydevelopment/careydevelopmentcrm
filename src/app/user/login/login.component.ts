import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    form: FormGroup;

    constructor(private fb: FormBuilder) {}
    /*constructor(private authenticationService: AuthenticationService) {
        let user$ = authenticationService.login("darth", "thedarkside");

        user$.subscribe(
            (data: any) => console.log(data),
            err => console.error(err)
        );
    }*/

    ngOnInit() {
        this.form = this.fb.group({
            'username': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
        });
    }

    onSubmit(loginForm) {
        if (this.form.valid) {
            console.log("The form is valid");
        } else {
            console.log("The form is NOT valid");
        }
    }
}
