import { IsNumber, IsString, Min, MinLength, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { EActionValueType, ESkills } from '@prisma/client';
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
    @ApiProperty()
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    baseValue: number;

    @IsString()
    @IsEnum(EActionValueType)
    @ApiProperty({
        enum: EActionValueType,
    })
    baseValueType: EActionValueType;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    @Type(() => AffectingSkillDTO)
    @ValidateNested()
    affectingSkills?: AffectingSkillDTO[];
}
