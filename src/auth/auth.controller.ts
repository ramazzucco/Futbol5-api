import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Req() req: Request, @Body() signInDto: SigninAuthDto, @Res() res: Response) {
    const user = await this.authService.signIn(signInDto.email, signInDto.password);
    const authorization = `Bearer ${user.token}`
    res.setHeader('authorization', authorization);
    return res.json(user);
  }
}
