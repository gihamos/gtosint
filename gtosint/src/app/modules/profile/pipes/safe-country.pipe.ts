import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeCountry'
})
export class SafeCountryPipe implements PipeTransform {

  transform(value: string | string[] | null | undefined, defaultValue = ''): string {
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : defaultValue;
    }
    if (typeof value === 'string') {
      return value;
    }
    return defaultValue;
  }

}