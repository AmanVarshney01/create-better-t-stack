import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";

export default function UserMenu() {
  return (
    <div>
      <SignedOut>
        <SignInButton>
          <Button variant="outline">Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
      </SignedIn>
    </div>
  );
}