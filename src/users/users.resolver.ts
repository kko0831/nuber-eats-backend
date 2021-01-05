import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  CreateAccountInput,
  CreateAccountOutput,
} from "./dtos/create-account.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query(() => Boolean)
  hi() {
    return true;
  }

  @Mutation(() => CreateAccountOutput)
  createAccount(@Args("input") createAccountInput: CreateAccountInput) {}
}
