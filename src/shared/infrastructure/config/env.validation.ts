import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
  ValidationError,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment, {
    message: 'MODE_API must be one of: development, production, test',
  })
  MODE_API: Environment;

  @Type(() => Number)
  @IsNumber({}, { message: 'PORT must be a number' })
  PORT: number;

  @Transform(({ value }: { value: string | number | boolean }) => {
    if (value === 'true' || value === true || value === '1' || value === 1) return true;
    if (value === 'false' || value === false || value === '0' || value === 0) return false;
    return value;
  })
  @IsBoolean({
    message: 'IS_SECURE must be a boolean (true/false) or (1/0)',
  })
  IS_SECURE: boolean;

  @IsString({ message: 'MONGO_CONNECTION_URI is required' })
  MONGO_CONNECTION_URI: string;

  @IsString()
  SIGNATURE_API_KEY: string;

  @IsString()
  SIGNATURE_SECRET_KEY: string;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'JWT_ACCESS_LIMIT must be a number in seconds' })
  JWT_ACCESS_LIMIT: number;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'JWT_REFRESH_LIMIT must be a number in seconds' })
  JWT_REFRESH_LIMIT: number;
}

function formatErrors(errors: ValidationError[]) {
  return errors
    .map((err) => {
      const messages = Object.values(err.constraints || {}).join(', ');
      return `${err.property}: ${messages}, but got value: "${err.value}"\n`;
    })
    .join('\n');
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false, // Strict mode
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const formattedMessage = formatErrors(errors);

    throw new Error(formattedMessage);
  }

  return validatedConfig;
}
