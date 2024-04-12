import { IsNumber, IsString, Min, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { EActionNames, EActionValueType, ESkills } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AffectingSkillDTO {
    @IsEnum(ESkills)
    @ApiProperty({
        enum: ESkills,
    })
    name: ESkills;

    @IsNumber()
    @Min(1)
    divider: number;
}

export class CreateActionDTO {
    @ApiProperty({
        enum: EActionNames,
    })
    @IsEnum(EActionNames)
    name: EActionNames;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    baseValue: number;

    @IsString()
    @IsEnum(EActionValueType)
    @ApiProperty({
        enum: EActionValueType,
    })
    resultType: EActionValueType;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    @Type(() => AffectingSkillDTO)
    @ValidateNested()
    affectingSkills?: AffectingSkillDTO[];
}
