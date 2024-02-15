import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { EmailService } from '../email/email.service';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        await this.emailService.welcomeEmail(authCredentialDto);
        return this.usersRepository.creatUser(authCredentialDto);
    }

    async signIn(authCredentialDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialDto;
        const user = await this.usersRepository.findOne({
            where: {
                username: username
            }
        });

        if (user && (bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = {
                username
            };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your login credentials')
        }

    }

    async findOneByName(username: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {
                username: username
            }
        });
        return user;
    }
}
