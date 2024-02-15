import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { AuthService } from '../auth/auth.service';



@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private authService: AuthService) { }

    validate(userName: any, args: ValidationArguments): Promise<boolean> {
        return this.authService.findOneByName(userName).then((user) => {
            if (user) {
                return false;
            }
            return true;
        });
    }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): any {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint,
        });
    };
}