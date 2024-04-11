import { Injectable } from '@nestjs/common';
import { CreateActionDTO } from './action.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ActionService {
    constructor(private prisma: PrismaService) {}

    async getMainActions() {
        return await this.prisma.mainAction.findMany({
            include: {
                action: true,
            },
        });
    }

    async createMainAction(actionDTO: CreateActionDTO) {
        try {
            await this.prisma.mainAction.create({
                data: {
                    action: {
                        create: {
                            name: actionDTO.name,
                            value: actionDTO.baseValue,
                            valueType: actionDTO.baseValueType,
                            affectingSkills: actionDTO.affectingSkills,
                        },
                    },
                },
            });
            return 'Main action was created';
        } catch (e) {
            return 'Main action was not created';
        }
    }

    async getExtraActions() {
        return await this.prisma.extraAction.findMany({
            include: {
                action: true,
            },
        });
    }

    async createExtraAction(actionDTO: CreateActionDTO) {
        try {
            await this.prisma.extraAction.create({
                data: {
                    action: {
                        create: {
                            name: actionDTO.name,
                            value: actionDTO.baseValue,
                            valueType: actionDTO.baseValueType,
                            affectingSkills: actionDTO.affectingSkills,
                        },
                    },
                },
            });
            return 'Extra action was created';
        } catch (e) {
            return 'Extra action was not created';
        }
    }
}
