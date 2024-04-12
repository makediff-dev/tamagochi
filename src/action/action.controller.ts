import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateActionDTO } from './action.dto';
import { ActionService } from './action.service';
import { EActionNames } from '@prisma/client';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'models/error-handler';

@ApiTags('Actions')
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
        const actionNameError = ErrorHandler.getActionNameError(action);
        if (actionNameError) {
            return actionNameError;
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

    @Get('extra')
    async getExtraActions() {
        return await this.actionService.getExtraActions();
    }

    @Post()
    async createAction(@Body() actionDTO: CreateActionDTO) {
        return await this.actionService.createAction(actionDTO);
    }
}
