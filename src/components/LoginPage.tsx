import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import LoginIllustration from "./LoginIllustration";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10 p-4">
      <Card className="w-full max-w-4xl overflow-hidden border-none shadow-lg grid md:grid-cols-2 bg-white">
        {/* Login Form Side */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-darker">
              Welcome Back
            </h1>
            <p className="text-neutral mt-2">Enter Your Screen To Login</p>
          </div>

          <form className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-shocking-pink/50"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter Your Password"
                className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-shocking-pink/50"
                required
              />
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-neutral hover:text-shocking-pink transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-pink-shocking to-cinnamon text-white py-2 rounded-md hover:opacity-90 transition-opacity"
              type="submit"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-neutral">
              Dont have an account?{" "}
              <Link
                href="/signup"
                className="text-shocking-pink hover:text-shocking-pink-dark font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Image Side */}
        <div className="hidden md:flex bg-shocking-pink-light/10 items-center justify-center p-6 relative">
          <LoginIllustration />
        </div>
      </Card>
    </main>
  );
}
