import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../user/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
