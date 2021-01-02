import { Query } from "@nestjs/graphql";
import { Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";

@Resolver (of=>User)
export class UserResolver{
    @Query(returns=>String)
    async getHello(): Promise<String>{
        return 'yellow'
    }
}