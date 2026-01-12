import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '@shared/infrastructure/config/env.service';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class SignatureService {
  private readonly logger = new Logger(SignatureService.name);

  constructor(private readonly envService: EnvService) {}

  computeSignature(accessToken: string, timestamp: string) {
    const apiKey = this.envService.signatureApiKey;
    const secretKey = this.envService.signatureSecretKey;

    const payload = `${apiKey}:${accessToken}:${timestamp}`;

    return createHmac('sha256', secretKey).update(payload).digest('hex');
  }

  validateSignature(
    incomingSignature: string,
    timestamp: string,
    accessToken: string,
    toleranceSeconds: number
  ): boolean {
    const reqTimestamp = parseInt(timestamp, 10);
    if (isNaN(reqTimestamp)) return false;

    const now = Math.floor(Date.now() / 1000);
    const diff = Math.abs(now - reqTimestamp);

    if (diff > toleranceSeconds) {
      this.logger.warn(`Signature rejected: timestamp expired (diff: ${diff}s)`);
      return false;
    }

    const expectedSignature = this.computeSignature(accessToken, timestamp);

    const signatureBuffer = Buffer.from(incomingSignature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  }
}
