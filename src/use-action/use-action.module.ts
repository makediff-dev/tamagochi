import { Module } from '@nestjs/common';
import { UseActionController } from './use-action.controller';
import { UseActionService } from './use-action.service';
import { UserService } from 'src/user/user.service';
import { ActionService } from 'src/action/action.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [UseActionController],
    providers: [UseActionService, UserService, ActionService, PrismaService],
})
export class UseActionModule {}
