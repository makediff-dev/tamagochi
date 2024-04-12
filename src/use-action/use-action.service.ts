import { Injectable } from '@nestjs/common';
import { Action, EActionNames, SkillSet } from '@prisma/client';
import { EChangeables } from 'prisma/prisma.types';
import { ActionService } from 'src/action/action.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UseActionService {
    constructor(
        private actionService: ActionService,
        private userService: UserService,
    ) {}

    private async getUserActionResult(action: Action, userSkillSet: SkillSet) {
        let affectedBySkillsRatio = 1;
        action.affectingSkills.forEach(skill => {
            affectedBySkillsRatio += userSkillSet[skill.name] / skill.divider;
        });

        return Math.floor(action.value * affectedBySkillsRatio);
    }

    async useMainAction(action: EActionNames, username: string) {
        const targetUser = await this.userService.getUserByName(username);
        if (!targetUser) {
            return 'User was not found';
        }

        const targetAction = await this.actionService.getActionByName(action);
        if (!action) {
            return 'Action was not found';
        }

        const completeMainAction = async (changeableField: EChangeables) => {
            const actionResult = await this.getUserActionResult(targetAction, targetUser.skillSet);
            await this.userService.updateUserChangeables(username, changeableField, actionResult + targetUser.changeables[changeableField]);
        };

        switch (action) {
            case 'getStone': {
                await completeMainAction(EChangeables.stone);
                return `Completed getStone action for user ${username}`;
            }
            case 'explore': {
                await completeMainAction(EChangeables.treasures);
                return `Completed explore action for user ${username}`;
            }
            case 'buildTownHall': {
                await completeMainAction(EChangeables.townHall);
                return `Completed buildTownHall action for user ${username}`;
            }
            default: {
                return 'You are trying to use an extra action';
            }
        }
    }
}
