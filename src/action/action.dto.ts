import { IsNumber, IsString, Min, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { EActionNames, EActionTypes, EActionResultType, EChangeables, ESkills } from '@prisma/client';
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

    @ApiProperty({
        enum: EActionTypes,
    })
    @IsEnum(EActionTypes)
    type: EActionTypes;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    baseValue: number;

    @IsString()
    @IsEnum(EActionResultType)
    @ApiProperty({
        enum: EActionResultType,
    })
    resultType: EActionResultType;

    @IsEnum(EChangeables)
    @ApiProperty({
        enum: EChangeables,
    })
    changeable: EChangeables;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    @Type(() => AffectingSkillDTO)
    @ValidateNested()
    affectingSkills?: AffectingSkillDTO[];
}
