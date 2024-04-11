import { Injectable } from '@nestjs/common';
import { CreateUserDTO, UserSkillDTO } from 'src/user/user.dto';
import { PrismaService } from 'src/prisma.service';
import { UserSkillSet } from './user.types';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    private async isUserExists(name: string) {
        const users = await this.prisma.user.findMany({
            where: {
                name,
            },
        });
        if (users.length > 0) {
            return true;
        }
        return false;
    }

    private initializeUserSkills(skillsDTO: UserSkillDTO[]) {
        const userSkills: UserSkillSet = {
            dexterity: 10,
            endurance: 10,
            intelligence: 10,
            karma: 10,
            strength: 10,
        };

        if (skillsDTO) {
            skillsDTO.forEach(skill => {
                userSkills[skill.name] = skill.value;
            });
        }

        return userSkills;
    }

    async createUser(userDto: CreateUserDTO) {
        if (await this.isUserExists(userDto.name)) {
            return 'User with this name already exists';
        }

        const userSkillSet = this.initializeUserSkills(userDto.skills);
        await this.prisma.user.create({
            data: {
                name: userDto.name,
                skillSet: {
                    create: userSkillSet,
                },
            },
        });
        return 'User was created';
    }

    async getUsers() {
        return await this.prisma.user.findMany({
            include: {
                skillSet: true,
            },
        });
    }

    async getUserByName(name: string) {
        return await this.prisma.user.findUnique({
            where: {
                name,
            },
            include: {
                skillSet: true,
            },
        });
    }

    async deleteUser(name: string) {
        const userToDelete = await this.getUserByName(name);

        if (!userToDelete) {
            return 'User was not found';
        }

        await this.prisma.user.delete({
            where: {
                name,
            },
        });

        if (userToDelete.skillSet)
            await this.prisma.skillSet.delete({
                where: {
                    id: userToDelete.skillSet.id,
                },
            });
        return 'User was deleted';
    }
}
