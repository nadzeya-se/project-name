import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import {hash, genSalt, compare} from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
        private readonly jwtService: JwtService
    ){}

    async login(dto:AuthDto){
        const user = await this.validateUser(dto)
        const tokens = await this.issueTokenPair(String(user._id))
    
        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    async register(dto:AuthDto){

        const oldUser = await this.UserModel.findOne({email: dto.email})
        if (oldUser)
        throw new BadRequestException('User with this email is already in the system')
        const salt = await genSalt(10)

        const newUser = new this.UserModel({
            email: dto.email,
            password: await hash(dto.password, salt)
        }
        )

        const tokens = await this.issueTokenPair(String(newUser._id))
    
        return {
            user: this.returnUserFields(newUser),
            ...tokens
        }
    }

    async validateUser(dto:AuthDto):Promise<UserModel>{
        const user = await this.UserModel.findOne({email: dto.email})
        if (!user) throw new UnauthorizedException('User not found')

        const isValidPassword = await compare(dto.password, user.password)
        if(!isValidPassword) throw new UnauthorizedException('Invalid password')

        return user
    }

    async issueTokenPair(userId: string){
        const data = {_id: userId}

        const refreshToken = await this.jwtService.signAsync(data,{
            expiresIn:'15d'
        })

        const accessToken = await this.jwtService.signAsync(data,{
            expiresIn:'1h'
        })

        return {refreshToken,accessToken}
    }
    returnUserFields(user:UserModel){
        return {
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }
    }

}
