import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness,  Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false)
 const [search, setSearch] = useSearchParams()
 const {user} = useUser()

 useEffect(() =>{
  if(search.get('sign-in')){
    setShowSignIn(true)
  }
 },[search])
 const handleOverlayClick = (e) => {
   if (e.target === e.currentTarget) {
     setShowSignIn(false);
     setSearch({});
   }
 };
  return (
    <>
      <nav className=" py-4 flex justify-between items-center">
        <Link>
          <img src="/logo.png" alt="logo" className="h-40" />
        </Link>
        <div className=" flex gap-8">
          <SignedOut>
            <Button
              variant="outline"
              className=" m-2 p-5 cursor-pointer"
              onClick={() => setShowSignIn(true)}
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role ==="recruiter" && <Link to="/post-job">
              <Button
                variant="destructive"
                className=" rounded-full cursor-pointer"
              >
                <PenBox size={20} className="mr-2" /> Post a Job
              </Button>
            </Link>}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};
export default Header;
