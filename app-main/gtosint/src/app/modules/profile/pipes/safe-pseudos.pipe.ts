import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safePseudos'
})
export class SafePseudosPipe implements PipeTransform {

  transform(value: string | string[] | null | undefined): string[] {
    if (Array.isArray(value)) {
      return value;
    }
    return value ? [value] : [];
  }

}