import { IsString, IsNotEmpty, IsArray, ValidateNested, ArrayMinSize, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
    @IsString()
    @IsNotEmpty()
    language_code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => TranslationDto)
    translations: TranslationDto[];
}

export class SearchProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    language_code: string;

    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;
}
