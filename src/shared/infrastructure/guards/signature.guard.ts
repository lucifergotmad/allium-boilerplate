import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@shared/infrastructure/decorators/public.decorator';
import { SignatureService } from '@shared/infrastructure/security/services/signature.service';
import { Request } from 'express';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(
    private readonly signatureService: SignatureService,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const signature = request.headers['x-signature'] as string;
    const timestamp = request.headers['x-timestamp'] as string;
    const authHeader = request.headers['authorization'] as string;

    if (!signature || !timestamp) {
      throw new UnauthorizedException('Missing Signature or Timestamp headers');
    }

    const token = this.extractTokenFromHeader(authHeader);

    const isValid = this.signatureService.validateSignature(signature, timestamp, token, 300);

    if (!isValid) {
      throw new UnauthorizedException('Invalid Signature or Expired Timestamp');
    }

    return true;
  }

  private extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) return '';
    const [type, token] = authHeader.split(' ');
    if (type?.toLowerCase() === 'bearer' && token) {
      return token;
    }
    return '';
  }
}
