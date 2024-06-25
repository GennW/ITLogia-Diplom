import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }


  formatDate(date: string): string {
    const commentDate = new Date(date);
    const day = ('0' + commentDate.getDate()).slice(-2);
    const month = ('0' + (commentDate.getMonth() + 1)).slice(-2);
    const year = commentDate.getFullYear();
    const hours = ('0' + commentDate.getHours()).slice(-2);
    const minutes = ('0' + commentDate.getMinutes()).slice(-2);

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
}
