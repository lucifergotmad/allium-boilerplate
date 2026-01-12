import { Module } from '@nestjs/common';
import { SignatureService } from '@shared/infrastructure/security/services/signature.service';

@Module({
  imports: [],
  providers: [SignatureService],
  exports: [SignatureService],
})
export class SecurityModule {}
