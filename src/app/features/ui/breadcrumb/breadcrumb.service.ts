import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private subject = new Subject<string>();

  onUpdate(): Observable<string> {
    return this.subject.asObservable();
  }

  updateBreadcrumb(str: string) {
    this.subject.next(str);
  }


}
