import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { EActionNames } from '@prisma/client';
import { UseActionService } from './use-action.service';

@Controller('use-actions')
export class UseActionController {
    constructor(private useActionService: UseActionService) {}

    @ApiParam({
        name: 'action',
        schema: {},
        enum: EActionNames,
    })
    @ApiParam({
        name: 'username',
        schema: {},
        type: String,
    })
    @Get('main/:action/:username')
    async useMainAction(@Param('action') action: EActionNames, @Param('username') username: string) {
        return await this.useActionService.useMainAction(action, username);
    }
}
