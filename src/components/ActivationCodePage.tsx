"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import LoginIllustration from "./LoginIllustration";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for validation
const activationFormSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Activation code must be 6 digits.",
    })
    .max(6),
});

// Type for our form values
type ActivationFormValues = z.infer<typeof activationFormSchema>;

export default function ActivationCodePage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  // Initialize the form
  const form = useForm<ActivationFormValues>({
    resolver: zodResolver(activationFormSchema),
    defaultValues: {
      code: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: ActivationFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Submitting activation code:", data);

      // In a real application, you would handle the API response here
      // and redirect on success
    } catch (error) {
      console.error("Activation error:", error);

      // Set form error on failure
      form.setError("code", {
        type: "manual",
        message: "Invalid code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    setIsResending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error resending code:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10 p-4">
      <Card className="w-full max-w-4xl overflow-hidden border-none shadow-lg grid md:grid-cols-2 bg-white">
        {/* Activation Code Form Side */}
        <div className="p-8 flex flex-col justify-center">
          <Link
            href="/login"
            className="flex items-center text-neutral hover:text-shocking-pink transition-colors mb-8 w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-neutral-darker">
              Enter Activation Code
            </h1>
            <p className="text-neutral mt-3">We've sent a code to your phone</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        className="gap-3 justify-center w-full max-w-md mx-auto"
                      >
                        <InputOTPGroup className="gap-3">
                          <InputOTPSlot
                            index={0}
                            className="h-14 w-14 text-xl border-neutral-200 shadow-sm  transition-all"
                          />
                          <InputOTPSlot
                            index={1}
                            className="h-14 w-14 text-xl border-neutral-200 shadow-sm  transition-all"
                          />
                          <InputOTPSlot
                            index={2}
                            className="h-14 w-14 text-xl border-neutral-200 shadow-sm  transition-all"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup className="gap-3">
                          <InputOTPSlot
                            index={3}
                            className="h-14 w-14 text-xl border-neutral-200 shadow-sm  transition-all"
                          />
                          <InputOTPSlot
                            index={4}
                            className="h-14 w-14 text-xl border-neutral-200 shadow-sm  transition-all"
                          />
                          <InputOTPSlot
                            index={5}
                            className="h-14 w-14 text-xl border-neutral-200 shadow-sm data-[active=true]:ring-[2px] transition-all"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-center mt-2" />
                  </FormItem>
                )}
              />
              <Button
                className="w-full max-w-md mx-auto bg-gradient-to-r from-pink-shocking to-cinnamon text-white rounded-md hover:opacity-90 transition-opacity ring-black"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          </Form>

          <div className="mt-10 text-center">
            <Button
              type="link"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-neutral hover:text-shocking-pink transition-colors flex items-center mx-auto font-medium disabled:opacity-50"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isResending ? "animate-spin" : ""}`}
              />
              {isResending ? "Sending..." : "Resend code"}
            </Button>

            <p className="text-neutral mt-5 text-sm">
              Code valid for 10 minutes
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
