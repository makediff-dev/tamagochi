import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [ActionController],
    providers: [ActionService, PrismaService],
})
export class ActionModule {}
