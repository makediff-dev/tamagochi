import { Changeables, SkillSet, User } from '@prisma/client';

export type UserFull = User & { skillSet: SkillSet; changeables: Changeables };
