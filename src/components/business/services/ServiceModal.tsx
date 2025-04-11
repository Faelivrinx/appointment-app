"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Service } from "./BusinessServicesPage";

// Form validation schema
const serviceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be less than 100 characters."),
  durationMinutes: z.coerce
    .number()
    .min(5, "Duration must be at least 5 minutes.")
    .max(480, "Duration cannot exceed 8 hours (480 minutes)."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative.").optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormValues) => void;
  service: Service | null;
}

export default function ServiceModal({
  isOpen,
  onClose,
  onSave,
  service,
}: ServiceModalProps) {
  // Initialize form
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      durationMinutes: 30,
      description: "",
      price: undefined,
    },
  });

  // Update form values when editing a service
  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        durationMinutes: service.durationMinutes,
        description: service.description || "",
        price: service.price,
      });
    } else {
      form.reset({
        name: "",
        durationMinutes: 30,
        description: "",
        price: undefined,
      });
    }
  }, [service, form]);

  // Handle form submission
  const handleSubmit = (data: ServiceFormValues) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {service ? "Edit Service" : "Add New Service"}
          </DialogTitle>
          <DialogDescription>
            {service
              ? "Update the details of your service."
              : "Add a new service to your business offerings."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Haircut & Style" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 29.99"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your service..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-accent-200 hover:bg-accent-100 text-white"
              >
                {service ? "Update Service" : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
