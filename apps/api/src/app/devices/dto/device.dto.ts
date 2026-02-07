import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExampleInfoDto {
  @IsString()
  @IsNotEmpty()
  hardware!: string;

  @IsString()
  @IsUrl()
  code!: string;
}

export class ProductInfoDto {
  @IsString()
  @IsUrl()
  url!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExampleInfoDto)
  example!: ExampleInfoDto[];

  @IsOptional()
  @IsString()
  @IsUrl()
  circuit?: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  datasheet?: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  reference?: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  note?: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  spec?: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  instructions?: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  guide?: string;
}

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  deviceName!: string;

  @IsIn(['GPIO', 'I2C', 'Other'])
  tag!: 'GPIO' | 'I2C' | 'Other';

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsUrl()
  image!: string;

  @ValidateNested()
  @Type(() => ProductInfoDto)
  product!: ProductInfoDto;
}

export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceName?: string;
  @IsOptional()
  @IsIn(['GPIO', 'I2C', 'Other'])
  tag?: 'GPIO' | 'I2C' | 'Other';
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  image?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductInfoDto)
  product?: ProductInfoDto;
}
