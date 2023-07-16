import { createParamDecorator } from "type-graphql";
import { GqlContext } from "../../../utils/gql-context";
export function CurrentUser() {
  return createParamDecorator<GqlContext>(({ context }) => context.user);
}
