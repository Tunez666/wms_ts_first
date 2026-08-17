import {
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole, UserStatus } from '../../../generated/prisma/enums';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}