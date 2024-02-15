import { TaskStatus } from "../task-status.enum";
import { IsNotEmpty, MinLength } from 'class-validator';
export class AddUpdateTaskDto {
    @MinLength(5, {
        message: 'Title length should be 10',
    })
    @IsNotEmpty({
        message: 'Title is required',
    })
    title: string;

    @IsNotEmpty()
    description: string;

    status: TaskStatus;
}