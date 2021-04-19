import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class UiUtil {

  scrollToTop() {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
  }
}
