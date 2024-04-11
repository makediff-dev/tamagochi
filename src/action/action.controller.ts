import { Body, Controller, Post } from '@nestjs/common';
import { CreateActionDTO } from './action.dto';

@Controller('actions')
export class ActionController {
    @Post('main')
    async createMainAction(@Body() actionDTO: CreateActionDTO) {}

    @Post('extra')
    async createExtraAction(@Body() actionDTO: CreateActionDTO) {}
}
