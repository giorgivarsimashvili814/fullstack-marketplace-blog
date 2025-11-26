import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAuthGuard } from 'src/auth/guard/is-auth.guard';
import { UserId } from './decorators/user.decorator';

@UseGuards(IsAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(
    @Param('id') targetUserId: string,
    @UserId() requestingUserId: string,
  ) {
    return this.usersService.findById(requestingUserId, targetUserId);
  }

  @Patch(':id')
  update(
    @Param('id') targetUserId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserId() requestingUserId: string,
  ) {
    return this.usersService.update(
      requestingUserId,
      targetUserId,
      updateUserDto,
    );
  }

  @Delete(':id')
  delete(
    @Param('id') targetUserId: string,
    @UserId() requestingUserId: string,
  ) {
    return this.usersService.delete(requestingUserId, targetUserId);
  }
}
