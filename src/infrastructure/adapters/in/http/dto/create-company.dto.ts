import { IsEnum, IsString } from "class-validator";
import { CompanyTypes } from "src/application/domain/company.type";


export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsEnum(CompanyTypes)
  type: CompanyTypes
}
