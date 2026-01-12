import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SignatureGuard } from '@shared/infrastructure/guards/signature.guard';
import { SecurityModule } from '@shared/infrastructure/security/security.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: SignatureGuard,
    },
  ],
  imports: [SecurityModule],
  exports: [],
})
export class CoreModule {}
