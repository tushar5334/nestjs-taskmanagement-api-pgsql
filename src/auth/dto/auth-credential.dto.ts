import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { IsUserAlreadyExist } from "../../custome-validators/is-user-already-exist";


export class AuthCredentialDto {
    @IsString()
    @MinLength(4)
    //@MaxLength(20)
    @IsUserAlreadyExist({
        message: 'User $value already exists. Choose another name.',
    })
    username: string;

    @IsString()
    @MinLength(8)
    //@MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: "Password is too weak." })
    password: string;
}