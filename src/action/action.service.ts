import { Injectable } from '@nestjs/common';
import { CreateActionDTO } from './action.dto';
import { PrismaService } from 'src/prisma.service';
import { EActionNames } from '@prisma/client';

@Injectable()
export class ActionService {
    constructor(private prisma: PrismaService) {}

    async getActionByName(action: EActionNames) {
        return await this.prisma.action.findUnique({
            where: {
                name: action,
            },
        });
    }

    async getActions() {
        return await this.prisma.action.findMany();
    }

    async getMainActions() {
        return await this.prisma.action.findMany({
            where: {
                type: 'main',
            },
        });
    }

    async getExtraActions() {
        return await this.prisma.action.findMany({
            where: {
                type: 'extra',
            },
        });
    }

    async createAction(actionDTO: CreateActionDTO) {
        try {
            await this.prisma.action.create({
                data: {
                    name: actionDTO.name,
                    type: actionDTO.type,
                    baseValue: actionDTO.baseValue,
                    resultType: actionDTO.resultType,
                    affectingSkills: actionDTO.affectingSkills,
                    changeable: actionDTO.changeable,
                },
            });
            return 'Main action was created';
        } catch (e) {
            return 'Main action was not created';
        }
    }
}
