import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    formSubmitted: boolean = false;

    constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.form = this.fb.group({
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])]
        });
    }

    onSubmit(loginForm) {
        this.formSubmitted = true;

        if (this.form.valid) {
            let username = this.form.controls['username'].value;
            let password = this.form.controls['password'].value;

            let user$ = this.authenticationService.login(username, password);

            user$.subscribe(
                (data: any) => console.log(data),
                err => console.error(err)
            );
        } else {
            console.log("The form is NOT valid");
            this.formSubmitted = false;
        }
    }
}
