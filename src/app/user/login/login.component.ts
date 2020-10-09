import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    constructor(private authenticationService: AuthenticationService) {
        let user$ = authenticationService.login("darth", "thedarkside");

        user$.subscribe(
            (data: any) => console.log(data),
            err => console.error(err)
        );
    }

  ngOnInit() {
  }

}
