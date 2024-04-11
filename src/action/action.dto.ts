import { IsNumber, IsString, Min, MinLength, IsEnum, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { EActionValueType, ESkills } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AffectingSkill {
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
    @ArrayMinSize(1)
    @ApiProperty()
    @Type(() => AffectingSkill)
    @ValidateNested()
    skills: AffectingSkill[];
}
