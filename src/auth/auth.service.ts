import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { JwtPayload } from './jwt-payload-interfaca';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService : JwtService
    ) {}

    async signUp(authCredentialDto : AuthCredentialDto) :Promise<void> {
        return this.userRepository.signUp(authCredentialDto);
    }

    async signIn(authCredentialDto : AuthCredentialDto) : Promise<{accessToken : string}> {

        const username = await this.userRepository.validateUserPassword(authCredentialDto);
        
        if(!username) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const payload: JwtPayload = {
            username
        };
        const accessToken = await this.jwtService.sign(payload);

        console.log(accessToken,"here is accessToken");

        return { accessToken };
    }
}
