import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value.email) {
      throw new BadRequestException('Email is required');
    }
    return value;
  }
}
