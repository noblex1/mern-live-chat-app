import {
  Eye,
  EyeOff,
  Image,
  Lock,
  MessageSquareIcon,
  MessagesSquareIcon,
  User,
  Loader,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSkeleton from "../components/AuthSkeleton.jsx";
import useAuthHook from "../hooks/useAuthhook.jsx";
import toast from "react-hot-toast";

function SignUpPage() {
  const { signUp, isSigningup } = useAuthHook();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting user:", userData);

    const res = await signUp(userData);

    if (res?.success) {
      toast.success(res.message || "Account created successfully!");
      setTimeout(() => navigate("/signin"), 2000); // redirect after 2 seconds
    } else {
      toast.error(res?.message || "Failed to sign up. Try again.");
    }
  };

  if (isSigningup) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen items-center pt-15">
      <div className="grid md:grid-cols-2 border h-screen p-10">
        <div className="w-full flex flex-col items-center border p-4">
          <MessagesSquareIcon />
          <h2>Welcome</h2>
          <p>Create a new account</p>

          <form
            className="w-full relative p-8 space-y-4"
            onSubmit={handleUserDataSubmit}
          >
            <div className="relative flex w-full items-center">
              <User className="absolute inset-y-0 left-0 ml-1 size-5 opacity-30" />
              <input
                type="text"
                id="username"
                placeholder="sahadev"
                className="border rounded p-1 w-full border-gray-500/45 pl-7"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
            </div>

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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 mr-1 size-5 opacity-30 cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 mr-1 size-5 opacity-30 cursor-pointer"
                />
              )}
            </div>

            <div className="relative flex w-full items-center">
              <Image className="absolute inset-y-0 left-0 ml-1 size-5 opacity-30" />
              <input
                type="url"
                id="avatar"
                placeholder="Enter your avatar URL"
                className="border rounded p-1 w-full border-gray-500/45 pl-7"
                value={userData.avatar}
                onChange={(e) =>
                  setUserData({ ...userData, avatar: e.target.value })
                }
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full p-3 bg-green-800 text-gray-300 rounded"
              >
                Create an account
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center space-x-2">
            <p>Have an account?</p>
            <Link to="/signin" className="underline cursor-pointer">
              Sign In
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

export default SignUpPage;