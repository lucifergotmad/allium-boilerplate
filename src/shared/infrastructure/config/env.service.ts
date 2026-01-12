import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from '@shared/core/constants/env/env-key.const';

@Injectable()
export class EnvService {
  private readonly _mode: string;
  private readonly _port: number;
  private readonly _secure: boolean;
  private readonly _dbConnectionURI: string;
  private readonly _signatureApiKey: string;
  private readonly _signatureSecretKey: string;
  private readonly _jwtAccessKey: string;
  private readonly _jwtAccessLimit: number;
  private readonly _jwtRefreshKey: string;
  private readonly _jwtRefreshLimit: number;

  constructor(private readonly configService: ConfigService) {
    this._mode = this.configService.getOrThrow<string>(EnvKey.MODE);
    this._port = this.configService.getOrThrow<number>(EnvKey.PORT);
    this._secure = this.configService.getOrThrow<boolean>(EnvKey.SECURE);
    this._dbConnectionURI = this.configService.getOrThrow<string>(EnvKey.DB_CONNECTION_URI);
    this._signatureApiKey = this.configService.getOrThrow<string>(EnvKey.SIGNATURE_API_KEY);
    this._signatureSecretKey = this.configService.getOrThrow<string>(EnvKey.SIGNATURE_SECRET_KEY);
    this._jwtAccessKey = this.configService.getOrThrow<string>(EnvKey.JWT_ACCESS_KEY);
    this._jwtAccessLimit = this.configService.getOrThrow<number>(EnvKey.JWT_ACCESS_LIMIT);
    this._jwtRefreshKey = this.configService.getOrThrow<string>(EnvKey.JWT_REFRESH_KEY);
    this._jwtRefreshLimit = this.configService.getOrThrow<number>(EnvKey.JWT_REFRESH_LIMIT);
  }

  get mode(): string {
    return this._mode;
  }

  get port(): number {
    return this._port;
  }

  get secure(): boolean {
    return this._secure;
  }

  get dbConnectionUri(): string {
    return this._dbConnectionURI;
  }

  get signatureApiKey(): string {
    return this._signatureApiKey;
  }

  get signatureSecretKey(): string {
    return this._signatureSecretKey;
  }

  get jwtAccessKey(): string {
    return this._jwtAccessKey;
  }

  get jwtAccessLimit(): number {
    return this._jwtAccessLimit;
  }

  get jwtRefreshKey(): string {
    return this._jwtRefreshKey;
  }

  get jwtRefreshLimit(): number {
    return this._jwtRefreshLimit;
  }
}
