import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController, JwtGuard } from './auth';
import { Cache } from './cache';
import { InvoicesController } from './invoices';
import { InvoiceSchema, UserSchema } from './models';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Invoice', schema: InvoiceSchema }]),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'dev-secret', signOptions: { expiresIn: '30d' } }),
  ],
  controllers: [AuthController, InvoicesController],
  providers: [Cache, JwtGuard],
})
export class AppModule {}
