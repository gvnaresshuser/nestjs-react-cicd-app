import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Delete,
  Param,
  Patch,
  //UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Throttle } from '@nestjs/throttler';
import { MyLoggerService } from '../../common/logger/my-logger/my-logger.service';
import { IdleTimeoutGuard } from '../../common/guards/idle-timeout/idle-timeout.guard';
//import { ActivityInterceptor } from '../../common/interceptors/activity/activity.interceptor';
import { GetIp } from '../../common/decorators/ipaddress.decorator';
import type { User } from '../../common/interfaces/user.interface';

//@UseGuards(JwtGuard, IdleTimeoutGuard)
//@UseInterceptors(ActivityInterceptor) // ✅ APPLY HERE
@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private readonly logger: MyLoggerService,
  ) {}

  //--------------- CUSTOM DECORATORS ------------------
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('ip')
  getIp(@GetIp() ip: string) {
    return ip;
  }
  //--------------- CUSTOM DECORATORS ------------------

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  //@Throttle('short')
  //@Throttle('long')
  @Throttle({ short: { ttl: 1000, limit: 1 } }) //overriding manually
  //@UseGuards(JwtGuard)
  /*  @UseGuards(JwtGuard, IdleTimeoutGuard)   // ✅ ADD THIS    
     @UseInterceptors(ActivityInterceptor) */
  @Get()
  findAll(@Query('limit') limit: string, @Query('offset') offset: string) {
    console.log('GOING TO LOG...');
    this.logger.log('Fetching all users');
    this.logger.warn('This is a warning');
    this.logger.debug('Debugging users API');
    this.logger.error('ERROR users API updated....');
    console.log('🚀 CONTROLLER HIT');
    return this.service.findAll(Number(limit) || 10, Number(offset) || 0);
  }

  @Get('admin')
  //@UseGuards(JwtGuard, RolesGuard)
  @UseGuards(JwtGuard, IdleTimeoutGuard, RolesGuard) // ✅ ADD HERE
  @Roles('ADMIN')
  adminRoute(@GetUser() user) {
    return { message: `Welcome ${user.role}` };
  }
  //---------------------------------------------
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
