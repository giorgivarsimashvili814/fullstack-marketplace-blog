import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserId } from 'src/users/decorators/user.decorator';
import { IsAuthGuard } from './guards/is-auth.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  SignUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(dto, res);
  }

  @Post('sign-out')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@UserId() userId: string) {
    return this.authService.getCurrentUser(userId);
  }
}
