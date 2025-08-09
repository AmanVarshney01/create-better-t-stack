import { SignUp } from "@clerk/clerk-react";

export default function SignUpForm() {
  return <SignUp routing="path" path="/sign-up" />;
}