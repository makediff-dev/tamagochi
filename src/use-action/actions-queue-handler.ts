import { EActionNames } from '@prisma/client';
import { UseActionService } from 'src/use-action/use-action.service';

type UserQueue = {
    isHandling: boolean;
    queue: EActionNames[];
};

export class ActionsQueueHandler {
    private usersQueue = new Map<string, UserQueue>();
    private ctx: UseActionService;

    constructor(ctx: UseActionService) {
        this.ctx = ctx;
    }

    public getUserQueue(username: string) {
        if (!this.usersQueue.has(username)) {
            this.usersQueue.set(username, { isHandling: false, queue: [] });
        }
        return this.usersQueue.get(username);
    }

    private async handleQueue(username: string, userQueue: UserQueue) {
        userQueue.isHandling = true;
        while (userQueue.queue.length > 0) {
            await this.ctx.useMainAction(userQueue.queue[0], username);
            userQueue.queue.shift();
        }
        userQueue.isHandling = false;
    }

    async addActionToQueue(username: string, action: EActionNames) {
        const userQueue = this.getUserQueue(username);
        userQueue.queue.push(action);

        if (!userQueue.isHandling) {
            await this.handleQueue(username, userQueue);
            return 'Completed all actions!';
        }

        return 'Action added to queue!';
    }
}
