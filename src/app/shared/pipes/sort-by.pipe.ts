import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
})
export class SortByPipe implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (b[field] < a[field]) {
        return -1;
      } else if (b[field] > a[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
