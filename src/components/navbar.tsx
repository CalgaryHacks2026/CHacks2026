"use client";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { push: navigate } = useRouter();
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      {/* Show the sign-in and sign-up buttons when the user is signed out */}
      <Button
        variant="ghost"
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </Button>
      <SignedOut>
        <SignInButton>
          <Button variant="ghost">Sign In</Button>
        </SignInButton>

        <SignUpButton>
          <Button variant="default">Sign Up</Button>
        </SignUpButton>
      </SignedOut>

      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/myposts");
          }}
        >
          My Posts
        </Button>
        <UserButton />
      </SignedIn>
    </header>
  );
};
