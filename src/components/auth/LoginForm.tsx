"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/lib/validators";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

// Type for our form values
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      // Call the login function from the auth context with email and password
      const success = await login(data.email, data.password);

      if (success) {
        // Get the redirect path from session storage or default to dashboard
        const redirectPath =
          sessionStorage.getItem("auth_redirect_path") || "/dashboard";
        sessionStorage.removeItem("auth_redirect_path");

        // Show success toast
        toast.success("Login successful!");

        // Redirect to the intended destination
        router.push(redirectPath);
      } else {
        form.setError("root", {
          type: "manual",
          message: "Invalid email or password. Please try again.",
        });
      }
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
    <>
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-100">
          Welcome Back
        </h1>
        <p className="text-text-200 mt-2">Enter Your Details To Login</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.formState.errors.root && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    className="w-full px-4 py-3 text-base border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-200/50 bg-bg-100 text-text-200"
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
                    className="w-full px-4 py-3 text-base border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-200/50 bg-bg-100 text-text-200"
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
              className="text-sm text-text-200 hover:text-accent-200 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            className="w-full bg-accent-200 text-bg-100 py-3 rounded-md hover:bg-accent-100 transition-colors text-base"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-text-200">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-accent-200 hover:text-accent-100 font-medium transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
