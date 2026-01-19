import { createValidatorDirective } from "@redwoodjs/graphql-server";
import gql from "graphql-tag";

export const schema = gql`
  """
  Use to skip authentication checks and allow public access.
  """
  directive @skipAuth on FIELD_DEFINITION
`;

const skipAuth = createValidatorDirective(schema, () => {
  return;
});

export default skipAuth;
