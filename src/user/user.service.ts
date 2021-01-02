import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import {
  EmailProfileInput,
  EmailProfileOutput,
} from './dtos/email-profile.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: 'Email already exists' };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async findById({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id: userId });
      if (user) {
        return { ok: true, user };
      }
    } catch (error) {
      return { ok: false, error: 'User not found' };
    }
  }

  async findByEmail(email: string): Promise<EmailProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ email });
      if (user) {
        return { ok: true, user };
      }
    } catch (error) {
      return { ok: false, error: 'User not found' };
    }
  }
}
