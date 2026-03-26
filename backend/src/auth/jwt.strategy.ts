import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';
import { JwtPayload } from "./interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new InternalServerErrorException('JWT_SECRET environment variable is not set');
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
              ExtractJwt.fromAuthHeaderAsBearerToken(),
              (request: Request) => {
                return request?.cookies?.access_token;
              },
            ]),
            secretOrKey: secret,
            passReqToCallback: false,
        })
    }

    async validate(payload: { sub: number; email?: string; name?: string}) : Promise<JwtPayload> {
        console.log('JWT validate called', payload);
      return { 
        userId: payload.sub,
        id: payload.sub,
        email: payload.email, 
        name: payload.name, 
      };
    }
}