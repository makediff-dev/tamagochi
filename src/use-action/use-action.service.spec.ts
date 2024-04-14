import { UseActionService } from './use-action.service';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { ActionService } from '../action/action.service';
import { UseActionController } from './use-action.controller';

describe('Tamagochi tests', () => {
    const prismaService = new PrismaService();
    const userService = new UserService(prismaService);
    const actionService = new ActionService(prismaService);
    const useActionService = new UseActionService(actionService, userService);
    const useActionController = new UseActionController(useActionService);
    const testUsername = 'testUser';

    describe('Clearing the environment', () => {
        it('Deleting user', async () => {
            await userService.deleteUser(testUsername);
            const user = await userService.getUserByName(testUsername);
            expect(user).toBeNull();
        });

        it('Deleting getStone action', async () => {
            await actionService.deleteAction('getStone');
            const deletedAction = await actionService.getActionByName('getStone');
            expect(deletedAction).toBeNull();
        });

        it('Deleting buildTownHall action', async () => {
            await actionService.deleteAction('buildTownHall');
            const deletedAction = await actionService.getActionByName('buildTownHall');
            expect(deletedAction).toBeNull();
        });

        it('Deleting getLootbox action', async () => {
            await actionService.deleteAction('getLootbox');
            const deletedAction = await actionService.getActionByName('getLootbox');
            expect(deletedAction).toBeNull();
        });
    });

    describe('Creating the environment', () => {
        it('Creating user', async () => {
            await userService.createUser({
                name: testUsername,
            });
            const createdUser = await userService.getUserByName(testUsername);
            expect(createdUser).toHaveProperty('name', testUsername);
        });

        it('Creating user queue', async () => {
            const userQueue = useActionController.actionsQueueHandler.getUserQueue(testUsername);
            expect(userQueue).toStrictEqual({ isHandling: false, queue: [] });
        });

        it('Creating getStone main action', async () => {
            await actionService.createAction({
                name: 'getStone',
                baseValue: 5,
                changeable: 'stone',
                resultType: 'fixed',
                type: 'main',
                affectingSkills: [
                    {
                        name: 'strength',
                        divider: 100,
                    },
                    {
                        name: 'endurance',
                        divider: 100,
                    },
                ],
            });
            const createdAction = await actionService.getActionByName('getStone');
            expect(createdAction).toHaveProperty('name', 'getStone');
        });

        it('Creating the buildTownHall main action', async () => {
            await actionService.createAction({
                name: 'buildTownHall',
                baseValue: 1,
                changeable: 'townHall',
                resultType: 'fixed',
                type: 'main',
                affectingSkills: [
                    {
                        name: 'dexterity',
                        divider: 100,
                    },
                    {
                        name: 'strength',
                        divider: 100,
                    },
                ],
            });
            const createdAction = await actionService.getActionByName('buildTownHall');
            expect(createdAction).toHaveProperty('name', 'buildTownHall');
        });

        it('Creating the getLootbox extra action', async () => {
            await actionService.createAction({
                name: 'getLootbox',
                baseValue: 10,
                changeable: 'lootboxes',
                resultType: 'random',
                type: 'extra',
            });
            const createdAction = await actionService.getActionByName('getLootbox');
            expect(createdAction).toHaveProperty('name', 'getLootbox');
        });
    });

    describe('Use user main & extra actions', () => {
        it('Using the getStone action', async () => {
            await useActionController.actionsQueueHandler.addActionToQueue(testUsername, 'getStone');
            const updatedUser = await userService.getUserByName(testUsername);
            expect(updatedUser.changeables.stone).toBe(5);
        }, 20000);

        it('Using the buildTownHall action', async () => {
            await useActionController.actionsQueueHandler.addActionToQueue(testUsername, 'buildTownHall');
            const updatedUser = await userService.getUserByName(testUsername);
            expect(updatedUser.changeables.townHall).toBe(1);
        }, 20000);

        // it('Using main action until getting lootbox by extra action', async () => {
        //     let user = await userService.getUserByName(testUsername);
        //     let tryCount = 0;
        //     while (user.changeables.lootboxes < 1 && tryCount < 50) {
        //         tryCount += 1;
        //         await useActionController.actionsQueueHandler.addActionToQueue(testUsername, 'getStone');
        //         user = await userService.getUserByName(testUsername);
        //     }
        //     expect(user.changeables.lootboxes).toBeGreaterThan(0);
        // }, 50000);
    });

    describe('Try user actions queue', () => {
        it('Generating queue of two getStone & one buildTownHall actions and expect last resolved to be the buildTownHall', async () => {
            const userQueue = useActionController.actionsQueueHandler.getUserQueue(testUsername);

            const firstPromise = useActionController.actionsQueueHandler.addActionToQueue(testUsername, 'getStone');
            useActionController.actionsQueueHandler.addActionToQueue(testUsername, 'getStone');
            useActionController.actionsQueueHandler.addActionToQueue(testUsername, 'getStone');
            useActionController.actionsQueueHandler.addActionToQueue(testUsername, 'buildTownHall');

            expect(userQueue.queue.length).toEqual(4);
            expect(userQueue.queue[userQueue.queue.length - 1]).toBe('buildTownHall');

            await firstPromise;
        });
    });
});
