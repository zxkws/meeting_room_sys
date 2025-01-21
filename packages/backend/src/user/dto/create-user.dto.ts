import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'test', required: true })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @IsString({
    message: '用户名必须是字符串',
  })
  @MinLength(6, {
    message: '用户名长度不能小于6',
  })
  @MaxLength(20, {
    message: '用户名长度不能大于20',
  })
  username: string;

  @ApiProperty({ description: '昵称', example: 'test', required: true })
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  @IsString({
    message: '昵称必须是字符串',
  })
  @MinLength(6, {
    message: '昵称长度不能小于6',
  })
  @MaxLength(20, {
    message: '昵称长度不能大于20',
  })
  nickName: string;

  @ApiProperty({ description: '密码', example: '123456', required: true })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @IsString({
    message: '密码必须是字符串',
  })
  @MinLength(6, {
    message: '密码长度不能小于6',
  })
  @MaxLength(20, {
    message: '密码长度不能大于20',
  })
  password: string;

  @ApiProperty({ description: '邮箱', example: 'test@example.com', required: true })
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;

  @ApiProperty({ description: '验证码', example: '123456', required: true })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @IsString({
    message: '验证码必须是字符串',
  })
  captcha: string;
}
