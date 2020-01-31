import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  public event: EventEmitter<any>;

  constructor() {
    this.event = new EventEmitter<any>();
  }

  public getSubstring(data: string, length: number): string {
    let shortenedData = '';
    if (data && data.length > length) {
      shortenedData = data.substring(0, length) + '..';
    } else {
      shortenedData = data;
    }
    return shortenedData;
  }

  public getNested(theObject: Object, path: string, separator: string): any {
    try {
      separator = separator || '.';
      return path.
      replace('[', separator).replace(']', '').
      split(separator).
      reduce(
        function(obj: any, property: string): any {
          return obj[property];
        }, theObject
      );

    } catch (err) {
      return undefined;
    }
  }
}
