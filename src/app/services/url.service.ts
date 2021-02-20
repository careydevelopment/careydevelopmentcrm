import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class UrlService {
  shortenUrlIfNecessary(returnUrl: string): string {
    let questionMark = returnUrl.indexOf("?");

    if (questionMark > -1) {
      returnUrl = returnUrl.substring(0, questionMark);
    }

    return returnUrl;
  }

  getQueryParams(returnUrl: string): any {
    let queryParams: any = {};

    let questionMark = returnUrl.indexOf("?");
    if (questionMark > -1) {
      let paramString = returnUrl.substring(questionMark + 1, returnUrl.length);
      let queryMap = this.getMapFromParamString(paramString);
      queryParams.queryParams = queryMap;
    }

    return queryParams;
  }

  private getMapFromParamString(paramString: string): Map<string, string> {
    let pairs: string[] = paramString.split("&");
    const paramMap = new Map();

    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      let map: string[] = pair.split("=");
      let key: string = map[0];
      let val: string = map[1];

      paramMap.set(key, val);
    }

    return paramMap;
  }
}
