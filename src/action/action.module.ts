import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
    controllers: [ActionController],
    providers: [ActionService, UserService, PrismaService],
})
export class ActionModule {}
