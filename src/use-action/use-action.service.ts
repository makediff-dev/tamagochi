import { Injectable } from '@nestjs/common';
import { Action, EActionNames, SkillSet } from '@prisma/client';
import { ActionService } from 'src/action/action.service';
import { UserService } from 'src/user/user.service';
import { UserFull } from 'src/user/user.types';

@Injectable()
export class UseActionService {
    constructor(
        private actionService: ActionService,
        private userService: UserService,
    ) {}

    private getFixedActionResult(action: Action, userSkillSet: SkillSet): number {
        let affectedBySkillsRatio = 1;
        action.affectingSkills.forEach(skill => {
            affectedBySkillsRatio += userSkillSet[skill.name] / skill.divider;
        });

        return action.baseValue * affectedBySkillsRatio;
    }

    private getRandomActionResult(action: Action, userSkillSet: SkillSet): boolean {
        const chance = this.getFixedActionResult(action, userSkillSet);
        const random = Math.random();
        if (chance / 100 >= random) {
            return true;
        }
        return false;
    }

    private async useAction(action: Action, user: UserFull) {
        let actionResult: number = 0;
        if (action.resultType === 'fixed') {
            actionResult = Math.floor(this.getFixedActionResult(action, user.skillSet));
        }
        if (action.resultType === 'random') {
            const chanceResult = this.getRandomActionResult(action, user.skillSet);
            actionResult = chanceResult ? 1 : 0;
        }

        if (actionResult > 0) {
            await this.userService.updateUserChangeables(user.name, action.changeable, actionResult + user.changeables[action.changeable]);
        }
    }

    async useExtraActions(user: UserFull) {
        const extraActions = await this.actionService.getExtraActions();

        for (const action of extraActions) {
            await this.useAction(action, user);
        }
    }

    async useMainAction(action: EActionNames, username: string) {
        const targetUser = await this.userService.getUserByName(username);
        if (!targetUser) {
            return 'User was not found';
        }

        const targetAction = await this.actionService.getActionByName(action);
        if (!targetAction) {
            return 'Action was not found';
        }
        if (targetAction.type !== 'main') {
            return 'You must define MAIN action name';
        }

        await this.useAction(targetAction, targetUser);
        await this.useExtraActions(targetUser);
        return `Completed ${targetAction.name} action for user ${targetUser.name}`;
    }
}
