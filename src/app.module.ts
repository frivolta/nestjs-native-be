import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { Verification } from './user/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { url } from 'inspector';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        DATABASE_URL: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          }),
      entities: [User, Verification],
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      synchronize: process.env.NODE_ENV !== 'prod',
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        if (req) {
          return { token: req.headers[TOKEN_KEY] };
        } else if (connection) {
          return { token: connection.context[TOKEN_KEY] };
        }
      },
    }),
    JwtModule.forRoot({
      privatekey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.SENDGRID_API_KEY,
      emailFrom: process.env.SENDGRID_FROM_ADDRESS,
    }),
    UserModule,
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
