import { Injectable } from '@nestjs/common';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { EnvService } from '@shared/infrastructure/config/env.service';

@Injectable()
export class AuthTokenPolicyService {
  constructor(private readonly envService: EnvService) {}

  /**
   * Policy untuk Access Token (Short lived, e.g., 15m)
   * Menggunakan Default Secret dari JWT Module atau Env khusus
   */
  public getAccessOptions(): JwtSignOptions {
    return {
      expiresIn: this.envService.jwtAccessLimit,
      secret: this.envService.jwtAccessKey,
    };
  }

  /**
   * Policy untuk Refresh Token (Long lived, e.g., 7d)
   * MENGGUNAKAN SECRET YANG BERBEDA dari Access Token
   */
  public getRefreshOptions(): JwtSignOptions {
    return {
      expiresIn: this.envService.jwtRefreshLimit,
      secret: this.envService.jwtRefreshKey,
    };
  }

  /**
   * Helper untuk Verify Options (dipakai di Handler)
   */
  public getRefreshVerifyOptions(): JwtVerifyOptions {
    return {
      secret: this.envService.jwtRefreshKey,
    };
  }
}
