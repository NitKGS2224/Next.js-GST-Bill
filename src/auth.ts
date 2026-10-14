import { Body, CanActivate, ConflictException, Controller, ExecutionContext, Get, Injectable, Post, Put, Req,
  UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

class RegisterDto { @IsEmail() email: string; @MinLength(6) password: string; @IsString() shopName: string; }
class LoginDto { @IsEmail() email: string; @IsString() password: string; }

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(c: ExecutionContext) {
    const req = c.switchToHttp().getRequest();
    const t = (req.headers.authorization || '').replace('Bearer ', '');
    try { req.uid = (await this.jwt.verifyAsync(t)).sub; return true; } catch { throw new UnauthorizedException(); }
  }
}

@Controller('auth')
export class AuthController {
  constructor(@InjectModel('User') private users: Model<any>, private jwt: JwtService) {}
  private safe(u: any) { const { password, ...r } = u.toObject(); return r; }
  private async out(u: any) { return { token: await this.jwt.signAsync({ sub: String(u._id) }), user: this.safe(u) }; }

  @Post('register')
  async register(@Body() b: RegisterDto) {
    if (await this.users.exists({ email: b.email.toLowerCase() })) throw new ConflictException('Email already registered');
    const u = await this.users.create({ email: b.email, shopName: b.shopName, password: await bcrypt.hash(b.password, 10) });
    return this.out(u);
  }
  @Post('login')
  async login(@Body() b: LoginDto) {
    const u = await this.users.findOne({ email: b.email.toLowerCase() });
    if (!u || !(await bcrypt.compare(b.password, u.password))) throw new UnauthorizedException('Wrong email or password');
    return this.out(u);
  }
  @UseGuards(JwtGuard) @Get('me')
  async me(@Req() r: any) { return this.safe(await this.users.findById(r.uid)); }
  @UseGuards(JwtGuard) @Put('me')
  async update(@Req() r: any, @Body() b: any) {
    const p: any = {};
    for (const k of ['shopName', 'gstin', 'address', 'phone']) if (typeof b[k] === 'string') p[k] = b[k].slice(0, 200);
    return this.safe(await this.users.findByIdAndUpdate(r.uid, p, { new: true }));
  }
}
