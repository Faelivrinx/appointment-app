"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { signupSchema } from "@/lib/validators";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

// Type for our form values
type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize the form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await signup({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        password: data.password,
      });

      toast.success(
        "Account created successfully! Please verify your account.",
      );

      // In a real application, you would handle the API response here
      // and redirect on success
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        "There was an error creating your account. Please try again.",
      );

      // Set form error on failure
      form.setError("root", {
        type: "manual",
        message: "There was an error creating your account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-100">
          Create Account
        </h1>
        <p className="text-text-200 mt-2">Enter Your Details To Sign Up</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="First Name"
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 text-base border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-200/50 bg-bg-100 text-text-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="email"
                    placeholder="Email Address"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="tel"
                    placeholder="Phone Number"
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
                    placeholder="Password"
                    className="w-full px-4 py-3 text-base border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-200/50 bg-bg-100 text-text-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              className="w-full bg-accent-200 text-bg-100 py-3 rounded-md hover:bg-accent-100 transition-colors text-base"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-text-200">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent-200 hover:text-accent-100 font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
