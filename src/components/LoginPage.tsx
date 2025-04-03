"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import LoginIllustration from "./LoginIllustration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for validation
const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, { message: "Email is required." }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters." }),
});

// Type for our form values
type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Submitting login data:", data);

      // In a real application, you would handle the API response here
      // and redirect on success
    } catch (error) {
      console.error("Login error:", error);

      // Set form error on failure
      form.setError("root", {
        type: "manual",
        message: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10 p-4">
      <Card className="w-full max-w-4xl overflow-hidden border-none shadow-lg grid md:grid-cols-2 bg-white">
        {/* Login Form Side */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-darker">
              Welcome Back
            </h1>
            <p className="text-neutral mt-2">Enter Your Details To Login</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="Enter Your Email"
                        className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-shocking-pink/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="password"
                        placeholder="Enter Your Password"
                        className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-shocking-pink/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-neutral">
              Don't have an account?{" "}
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
