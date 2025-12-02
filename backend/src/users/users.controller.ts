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
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
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
    @UserId() requestingUserId: string,
    @Param('id') targetUserId: string,
  ) {
    return this.usersService.findById(requestingUserId, targetUserId);
  }

  @Patch()
  update(
    @UserId() requestingUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(requestingUserId, updateUserDto);
  }

  @Delete()
  delete(@UserId() requestingUserId: string) {
    return this.usersService.delete(requestingUserId);
  }
}
