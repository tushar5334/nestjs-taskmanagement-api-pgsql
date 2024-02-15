import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async creatUser(authCredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialDto
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user: User = this.create({
            username,
            password: hashedPassword
        });
        await this.save(user);
    }
}