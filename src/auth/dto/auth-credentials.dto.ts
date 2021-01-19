import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsEmail()
  @MinLength(4)
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
