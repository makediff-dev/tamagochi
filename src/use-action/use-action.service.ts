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

    private getFlatActionResult(action: Action, userSkillSet: SkillSet): number {
        let affectedBySkillsRatio = 1;
        action.affectingSkills.forEach(skill => {
            affectedBySkillsRatio += userSkillSet[skill.name] / skill.divider;
        });

        return action.baseValue * affectedBySkillsRatio;
    }

    private getPercentActionResult(action: Action, userSkillSet: SkillSet): boolean {
        const chance = this.getFlatActionResult(action, userSkillSet);
        const random = Math.random();
        if (chance / 100 >= random) {
            return true;
        }
        return false;
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
            let actionResult: number = 0;
            if (targetAction.resultType === 'flat') {
                actionResult = Math.floor(this.getFlatActionResult(targetAction, targetUser.skillSet));
            }
            if (targetAction.resultType === 'percent') {
                const chanceResult = this.getPercentActionResult(targetAction, targetUser.skillSet);
                actionResult = chanceResult ? 1 : 0;
            }

            if (actionResult > 0) {
                await this.userService.updateUserChangeables(username, changeableField, actionResult + targetUser.changeables[changeableField]);
            }
        };

        switch (action) {
            case 'getStone': {
                await completeMainAction(EChangeables.stone);
                return `Completed getStone action for user ${username}`;
            }
            case 'exploreArea': {
                await completeMainAction(EChangeables.treasures);
                return `Completed exploreArea action for user ${username}`;
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
