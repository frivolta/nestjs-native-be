import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class EmailProfileInput {
  @Field((type) => String)
  email: string;
}

@ObjectType()
export class EmailProfileOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
