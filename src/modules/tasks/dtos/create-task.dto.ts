import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  completed: boolean;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  userId: string;
}
