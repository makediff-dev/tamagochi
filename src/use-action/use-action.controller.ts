import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { EActionNames } from '@prisma/client';
import { UseActionService } from './use-action.service';
import { ErrorHandler } from '../../models/error-handler';
import { ActionsQueueHandler } from './actions-queue-handler';

@ApiTags('Use Actions')
@Controller('use-actions')
export class UseActionController {
    actionsQueueHandler: ActionsQueueHandler;

    constructor(useActionService: UseActionService) {
        this.actionsQueueHandler = new ActionsQueueHandler(useActionService);
    }

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
    @Get(':action/:username')
    async useMainAction(@Param('action') action: EActionNames, @Param('username') username: string) {
        const actionNameError = ErrorHandler.getActionNameError(action);
        if (actionNameError) {
            return actionNameError;
        }

        return await this.actionsQueueHandler.addActionToQueue(username, action);
    }
}
