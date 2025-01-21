import { Controller, Post, Body, Get, Query, Inject, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireLogin, RequirePermission, UserInfo } from 'src/custom.decorator';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Get('refresh-token')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(decoded.userId);
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );
      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @ApiOperation({ summary: '发送注册验证码' })
  @ApiQuery({ name: 'address', description: '邮箱地址', required: true, example: 'test@example.com', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: '发送成功', type: String })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '发送失败', type: String })
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendEmail(address, '注册验证码', `<p>你的注册验证码是 ${code}</p>`);
    return '发送成功';
  }

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @RequireLogin()
  @Post('update')
  update(@Body() updateUserDto: UpdateUserDto, @UserInfo() userInfo: typeof UserInfo) {
    return this.userService.update(updateUserDto, userInfo);
  }

  @RequireLogin()
  @Post('update-password')
  updatePassword(@Body() updatePasswordDto: UpdateUserDto, @UserInfo() userInfo: typeof UserInfo) {
    return this.userService.updatePassword(updatePasswordDto, userInfo);
  }

  @RequirePermission('user:list')
  @Post('list')
  list(@Body() listDto: { page?: number; pageSize?: number; username?: string; nickName?: string; email?: string; phoneNumber?: string }) {
    return this.userService.list(listDto);
  }

  @RequirePermission('user:freeze')
  @Post('freeze')
  freeze(@Body() freezeDto: { id: string }) {
    return this.userService.freeze(freezeDto);
  }
}
