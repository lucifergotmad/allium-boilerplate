export abstract class TimeServicePort {
  abstract formatDate(date: string | Date, format: string): string;
}
