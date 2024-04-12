import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateActionDTO } from './action.dto';
import { ActionService } from './action.service';
import { EActionNames } from '@prisma/client';
import { ApiParam } from '@nestjs/swagger';

@Controller('actions')
export class ActionController {
    constructor(private actionService: ActionService) {}

    @ApiParam({
        name: 'action',
        schema: {},
        enum: EActionNames,
    })
    @Get('all/:action')
    async getActionByName(@Param('action') action: EActionNames) {
        if (!Object.values(EActionNames).some(name => name === action)) {
            return `Invalid action name. Should be one of ${Object.values(EActionNames).join(', ')}`;
        }

        const targetAction = await this.actionService.getActionByName(action);
        if (!targetAction) {
            return 'Action was not found';
        }

        return targetAction;
    }

    @Get('main')
    async getMainActions() {
        return await this.actionService.getMainActions();
    }

    @Post('main')
    async createMainAction(@Body() actionDTO: CreateActionDTO) {
        return await this.actionService.createMainAction(actionDTO);
    }

    @Get('extra')
    async getExtraActions() {
        return await this.actionService.getExtraActions();
    }

    @Post('extra')
    async createExtraAction(@Body() actionDTO: CreateActionDTO) {
        return await this.actionService.createExtraAction(actionDTO);
    }
}
