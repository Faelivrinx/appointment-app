"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { activationCodeSchema } from "@/lib/validators";

// Type for our form values
type ActivationFormValues = z.infer<typeof activationCodeSchema>;

export default function ActivationForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  // Initialize the form
  const form = useForm<ActivationFormValues>({
    resolver: zodResolver(activationCodeSchema),
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
    <>
      <Link
        href="/login"
        className="flex items-center text-text-200 hover:text-accent-200 transition-colors mb-6 md:mb-8 w-fit"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-100">
          Enter Activation Code
        </h1>
        <p className="text-text-200 mt-3">We've sent a code to your phone</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:space-y-8"
        >
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
                    className="gap-2 sm:gap-3 justify-center w-full max-w-md mx-auto"
                  >
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      <InputOTPSlot
                        index={0}
                        className="h-12 w-12 sm:h-14 sm:w-14 text-xl border-bg-300 shadow-sm transition-all bg-bg-100 text-text-200"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-12 w-12 sm:h-14 sm:w-14 text-xl border-bg-300 shadow-sm transition-all bg-bg-100 text-text-200"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-12 w-12 sm:h-14 sm:w-14 text-xl border-bg-300 shadow-sm transition-all bg-bg-100 text-text-200"
                      />
                    </InputOTPGroup>
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      <InputOTPSlot
                        index={3}
                        className="h-12 w-12 sm:h-14 sm:w-14 text-xl border-bg-300 shadow-sm transition-all bg-bg-100 text-text-200"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-12 w-12 sm:h-14 sm:w-14 text-xl border-bg-300 shadow-sm transition-all bg-bg-100 text-text-200"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-12 w-12 sm:h-14 sm:w-14 text-xl border-bg-300 shadow-sm bg-bg-100 text-text-200 data-[active=true]:ring-accent-200 data-[active=true]:ring-[2px] transition-all"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-center mt-2" />
              </FormItem>
            )}
          />
          <Button
            className="w-full max-w-md mx-auto bg-accent-200 text-bg-100 py-3 rounded-md hover:bg-accent-100 transition-colors text-base"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 md:mt-8 text-center">
        <Button
          type="button"
          onClick={handleResendCode}
          disabled={isResending}
          className="text-text-200 hover:text-accent-200 transition-colors flex items-center mx-auto font-medium disabled:opacity-50"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isResending ? "animate-spin" : ""}`}
          />
          {isResending ? "Sending..." : "Resend code"}
        </Button>

        <p className="text-text-200 mt-4 text-sm">Code valid for 10 minutes</p>
      </div>
    </>
  );
}
