import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "nestjs-typegoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserModel } from "src/user/user.model";
import { ModelType } from "typegoose";


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
constructor(private readonly configService: ConfigService, @InjectModel(UserModel) private readonly UserModel:ModelType<UserModel>){
super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration:true,
    secretKey: configService.get('JWT_SECRET')
})
}

async validate({_id}:Pick<UserModel, '_id'>){
    return this.UserModel.findById(_id).exec()
}

}