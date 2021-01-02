import { Field,  InputType,  ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum UserRole {
    Admin = "Admin",
    Client = "Client",
}
  
registerEnumType(UserRole, {name: "UserRole"})

@InputType('UserInputType',{isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{
    @Column()
    @Field(type => String)
    @IsEmail()
    @IsString()
    email: string;
    
    @Column({select: false})
    @Field(type => String)
    @IsString()
    password: string;
    
    @Column(
      {type: "enum", enum:UserRole}
    )
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;
  
    @Column({ default: false })
    @Field(type => Boolean)
    @IsBoolean()
    isVerified: boolean;

    @Column({ default: false })
    @Field(type => Boolean)
    @IsBoolean()
    isPremium: boolean;
}