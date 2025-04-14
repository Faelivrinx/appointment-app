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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Staff, StaffFormData } from "@/types/staff";
import { Service } from "@/components/business/services/BusinessServicesPage";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Form validation schema
const staffSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be less than 100 characters."),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(1, "Email is required."),
  phone: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\+?[0-9\s()-]{8,}$/, {
      message: "Please enter a valid phone number.",
    }),
  services: z.array(z.string()),
  profileImage: z.string().optional(),
});

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StaffFormData) => void;
  staff: Staff | null;
  services: Service[];
}

export default function StaffModal({
  isOpen,
  onClose,
  onSave,
  staff,
  services,
}: StaffModalProps) {
  // Initialize form
  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      services: [],
      profileImage: "",
    },
  });

  // Update form values when editing
  useEffect(() => {
    if (staff) {
      form.reset({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        services: staff.services.map((service) => service.id),
        profileImage: staff.profileImage || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        services: [],
        profileImage: "",
      });
    }
  }, [staff, form]);

  // Handle form submission
  const handleSubmit = (data: StaffFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {staff ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
          <DialogDescription>
            {staff
              ? "Update the details of your staff member."
              : "Add a new staff member to your business."}
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
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. jane.smith@example.com"
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value.length && "text-muted-foreground",
                            )}
                          >
                            {field.value.length > 0
                              ? `${field.value.length} service${field.value.length !== 1 ? "s" : ""} selected`
                              : "Select services"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search services..." />
                          <CommandEmpty>No services found.</CommandEmpty>
                          <CommandGroup>
                            {services.map((service) => (
                              <CommandItem
                                key={service.id}
                                value={service.name}
                                onSelect={() => {
                                  const selected = [...field.value];
                                  const index = selected.indexOf(service.id);

                                  if (index === -1) {
                                    selected.push(service.id);
                                  } else {
                                    selected.splice(index, 1);
                                  }

                                  field.onChange(selected);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value.includes(service.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {service.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {field.value.map((serviceId) => {
                        const service = services.find(
                          (s) => s.id === serviceId,
                        );
                        return service ? (
                          <span
                            key={service.id}
                            className="text-xs px-2 py-1 bg-accent-100/20 text-accent-200 rounded-full"
                          >
                            {service.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter image URL"
                      {...field}
                      value={field.value || ""}
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
                {staff ? "Update Staff" : "Add Staff"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
