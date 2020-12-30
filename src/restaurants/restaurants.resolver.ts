import { Args, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => [Restaurant])
  restaurants(@Args("veganOnly") veganOnly: boolean): Restaurant[] {
    return [];
  }
}
