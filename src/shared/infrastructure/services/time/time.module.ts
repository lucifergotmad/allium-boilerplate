import { Module } from '@nestjs/common';
import { timeProvider } from '@shared/infrastructure/services/time/time.provider';

@Module({
  imports: [],
  providers: [timeProvider],
  exports: [timeProvider],
})
export class TimeModule {}
