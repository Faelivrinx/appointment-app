"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, Edit, Calendar } from "lucide-react";
import { Staff } from "@/types/staff";

interface StaffDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onEdit: () => void;
}

export default function StaffDetailsModal({
  isOpen,
  onClose,
  staff,
  onEdit,
}: StaffDetailsModalProps) {
  if (!staff) return null;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{staff.name}</DialogTitle>
          <DialogDescription>Staff member details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img
                src={staff.profileImage || "/api/placeholder/128/128"}
                alt={staff.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-accent-200" />
            <span className="font-medium">Email:</span>
            <span className="ml-2">{staff.email}</span>
          </div>

          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2 text-accent-200" />
            <span className="font-medium">Phone:</span>
            <span className="ml-2">{staff.phone}</span>
          </div>

          <div>
            <div className="font-medium mb-2">Services:</div>
            <div className="flex flex-wrap gap-2">
              {staff.services.map((service) => (
                <span
                  key={service.id}
                  className="text-xs px-2 py-1 bg-accent-100/20 text-accent-200 rounded-full"
                >
                  {service.name}
                </span>
              ))}
              {staff.services.length === 0 && (
                <span className="text-xs text-text-200">
                  No services assigned
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-muted">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-text-200" />
              <span className="text-sm text-text-200">
                Added: {formatDate(staff.createdAt)}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-text-200" />
              <span className="text-sm text-text-200">
                Last updated: {formatDate(staff.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button
            onClick={onEdit}
            className="bg-accent-200 hover:bg-accent-100 text-white flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
