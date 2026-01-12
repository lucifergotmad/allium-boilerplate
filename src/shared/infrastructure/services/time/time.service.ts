import * as moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';
import { TimeServicePort } from '@shared/domain/ports/time.service.port';

@Injectable()
export class TimeService implements TimeServicePort {
  formatDate(date: string | Date, format: string): string {
    const stringToDate = new Date(date);
    return moment.tz(stringToDate, 'Asia/Jakarta').format(format);
  }
}
