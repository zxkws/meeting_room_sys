import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { md5 } from 'src/utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class UserService {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisService,
  ) {}

  async findUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginDto.username,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new BadRequestException('用户不存在或密码错误');
    }

    if (user.password !== md5(loginDto.password)) {
      throw new BadRequestException('用户不存在或密码错误');
    }

    if (user.isFrozen) {
      throw new BadRequestException('用户已冻结');
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      headPic: user.headPic,
      phoneNumber: user.phoneNumber,
      email: user.email,
      createTime: user.createTime,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };

    vo.accessToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        username: user.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn: this.configService.get('jwt_access_token_expires_time'),
      },
    );

    vo.refreshToken = await this.jwtService.signAsync(
      {
        userId: user.id,
      },
      {
        expiresIn: this.configService.get('jwt_access_token_expires_time'),
      },
    );

    return vo;
  }

  async update(updateUserDto: UpdateUserDto, userInfo) {
    const user = await this.userRepository.findOneBy({
      id: userInfo.userId,
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const captcha = await this.redisService.get(`captcha_${updateUserDto.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== updateUserDto.captcha) {
      throw new BadRequestException('验证码错误');
    }

    user.nickName = updateUserDto.nickName;
    user.phoneNumber = updateUserDto.phoneNumber;
    user.email = updateUserDto.email;
    user.headPic = updateUserDto.headPic;
    try {
      await this.userRepository.save(user);
      return '更新成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '更新失败';
    }
  }

  async list(listDto: { page?: number; pageSize?: number; username?: string; nickName?: string; email?: string; phoneNumber?: string }) {
    const { page = 1, pageSize = 10 } = listDto;
    const condition: Record<string, any> = {};

    if (listDto.username) {
      condition.username = Like(`%${listDto.username}%`);
    }
    if (listDto.nickName) {
      condition.nickName = Like(`%${listDto.nickName}%`);
    }
    if (listDto.email) {
      condition.email = Like(`%${listDto.email}%`);
    }
    if (listDto.phoneNumber) {
      condition.phoneNumber = Like(`%${listDto.phoneNumber}%`);
    }
    const [users, total] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'nickName', 'email', 'phoneNumber', 'isFrozen', 'headPic', 'createTime'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: condition,
    });
    return { users, total };
  }

  async freeze(freezeDto: { id: string }) {
    const user = await this.userRepository.findOneBy({
      id: +freezeDto.id,
    });
    user.isFrozen = true;
    await this.userRepository.save(user);
    return '冻结成功';
  }

  async updatePassword(updatePasswordDto: UpdateUserDto, userInfo) {
    const user = await this.userRepository.findOneBy({
      id: userInfo.userId,
    });

    const captcha = await this.redisService.get(`captcha_${updatePasswordDto.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== updatePasswordDto.captcha) {
      throw new BadRequestException('验证码错误');
    }

    if (!user) {
      throw new BadRequestException('用户不存在或原密码错误');
    }

    user.password = md5(updatePasswordDto.password);

    try {
      await this.userRepository.save(user);
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '密码修改失败';
    }
  }

  private readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    const captcha = await this.redisService.get(`captcha_${createUserDto.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== createUserDto.captcha) {
      throw new BadRequestException('验证码错误');
    }

    const foundUser = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });
    if (foundUser) {
      throw new BadRequestException('用户名已存在');
    }

    const user = new User();
    user.username = createUserDto.username;
    user.password = md5(createUserDto.password);
    user.email = createUserDto.email;
    user.nickName = createUserDto.nickName;
    try {
      await this.userRepository.save(user);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  async init() {
    if (!process.env.INIT_ENABLE) {
      return false;
    }
    const permissions = new Permission();
    permissions.description = '查询用户列表';
    permissions.code = 'user:list';
    await this.permissionRepository.save(permissions);

    const permissions2 = new Permission();
    permissions2.description = '冻结用户';
    permissions2.code = 'user:freeze';
    await this.permissionRepository.save(permissions2);

    const role = new Role();
    role.name = 'admin';
    role.permissions = [permissions];
    await this.roleRepository.save(role);

    const user = new User();
    user.username = 'admin';
    user.password = md5('123456');
    user.email = 'admin@admin.com';
    user.nickName = '管理员';
    user.isAdmin = true;
    user.isFrozen = false;
    user.roles = [role];

    await this.userRepository.save(user);
  }
}
