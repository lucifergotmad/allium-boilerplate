import { Module } from '@nestjs/common';
import { hashServiceProvider } from '@shared/infrastructure/services/hash/bcrypt.hash.provider';

@Module({
  imports: [],
  providers: [hashServiceProvider],
  exports: [hashServiceProvider],
})
export class HashModule {}
