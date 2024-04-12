import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/user/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() userDTO: CreateUserDTO) {
        return await this.userService.createUser(userDTO);
    }

    @Get()
    async getUsers() {
        return await this.userService.getUsers();
    }

    @Get(':name')
    async getUserByName(@Param('name') name: string) {
        const targetUser = await this.userService.getUserByName(name);
        if (!targetUser) {
            return 'User was not found';
        }
        return targetUser;
    }

    @Delete(':name')
    async deleteUser(@Param('name') name: string) {
        return await this.userService.deleteUser(name);
    }
}
