import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenDescription'
})
export class ShortenDescriptionPipe implements PipeTransform {

  transform(description: string): string {
    if (description && description.length > 100) {
        return description.substring(0, 100) + '...';
    } else {
        return description;
    }
  }

}
