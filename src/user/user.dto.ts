import { ApiProperty } from '@nestjs/swagger';
import { ESkills } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';

export class UserSkillDTO {
    @ApiProperty({
        enum: ESkills,
    })
    @IsEnum(ESkills)
    name: ESkills;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    value: number;
}

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @MinLength(5)
    name: string;

    @ApiProperty({
        description: 'Default skills equals 10',
    })
    @IsArray()
    @Type(() => UserSkillDTO)
    @ValidateNested()
    @IsOptional()
    skills?: Array<UserSkillDTO>;
}
