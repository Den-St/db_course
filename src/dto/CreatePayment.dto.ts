import { IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  tuition_fee_id: number;

  @IsNumber()
  @Min(0)
  amount_paid: number;

  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  receipt_reference?: string;
}
