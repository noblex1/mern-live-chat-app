import {
  Eye,
  EyeOff,
  Lock,
  MessageSquareIcon,
  MessagesSquareIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSkeleton from "../components/AuthSkeleton.jsx";
import useAuthHook from "../hooks/useAuthhook.jsx";
import { toast } from "react-hot-toast";

function SignInPage() {
  const navigate = useNavigate();
  const { signIn, isSigningIn } = useAuthHook();

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(userData);
    if (result?.success) {
      toast.success(result.message || "Signed in successfully!");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } else {
      toast.error(result?.message || "Invalid credentials");
    }
  };

  return (
    <div className="w-full h-screen items-center pt-15">
      <div className="grid md:grid-cols-2 border h-screen p-10">
        <div className="w-full flex flex-col items-center border p-4">
          <MessagesSquareIcon />
          <h2>Welcome</h2>
          <p>Sign Into Your Account</p>

          <form
            className="w-full relative p-8 space-y-4"
            onSubmit={handleSignInSubmit}
          >
            <div className="relative flex w-full items-center">
              <MessageSquareIcon className="absolute inset-y-0 left-0 ml-1 size-5 opacity-30" />
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                className="border rounded p-1 w-full border-gray-500/45 pl-7"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>

            <div className="relative flex w-full items-center">
              <Lock className="absolute inset-y-0 left-0 ml-1 size-5 opacity-30" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••••"
                className="border rounded p-1 w-full border-gray-500/45 pl-7"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
              {showPassword ? (
                <EyeOff
                  onClick={() => setShowPassword(false)}
                  className="absolute inset-y-0 right-0 mr-1 size-5 opacity-30 cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => setShowPassword(true)}
                  className="absolute inset-y-0 right-0 mr-1 size-5 opacity-30 cursor-pointer"
                />
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full p-3 bg-green-800 text-gray-300 rounded"
              >
                {isSigningIn ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center space-x-2">
            <p>Don't have an account?</p>
            <Link to="/signup" className="underline cursor-pointer">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="w-full">
          <AuthSkeleton
            title={"Welcome to HackChat"}
            text={"Join our community of hackers to learn how to build the next web"}
          />
        </div>
      </div>
    </div>
  );
}

export default SignInPage;