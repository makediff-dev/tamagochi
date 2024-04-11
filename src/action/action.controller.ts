import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateActionDTO } from './action.dto';
import { ActionService } from './action.service';

@Controller('actions')
export class ActionController {
    constructor(private actionService: ActionService) {}

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
