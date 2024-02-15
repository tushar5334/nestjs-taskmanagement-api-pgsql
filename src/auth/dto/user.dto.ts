import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { IsUserAlreadyExist } from "../../custome-validators/is-user-already-exist";


export class UserDto {
    @IsString()
    @MinLength(4)
    //@MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    //@MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: "Password is too weak." })
    password: string;
}