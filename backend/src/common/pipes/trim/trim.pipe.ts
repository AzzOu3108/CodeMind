import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    const trimmedObj = {};

    for (const key of Object.keys(value)) {
      const field = value[key];

      if (typeof field === 'string') {
        trimmedObj[key] = field.trim();
      } else {
        trimmedObj[key] = field;
      }
    }
    return trimmedObj;
  }
}
