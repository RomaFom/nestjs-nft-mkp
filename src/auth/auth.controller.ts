import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

import { TokenDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResponseUserDto } from '../users/dto/response-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: TokenDto })
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/registration')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: TokenDto })
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Get('/get-user')
  @ApiOperation({ summary: 'Get user by token' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: ResponseUserDto })
  getUser(@Req() req) {
    return this.authService.getUser(req.user.id);
  }
}
