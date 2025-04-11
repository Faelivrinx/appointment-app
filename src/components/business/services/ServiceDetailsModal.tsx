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
import { Clock, DollarSign, Edit, Calendar } from "lucide-react";
import { Service } from "./BusinessServicesPage";

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onEdit: () => void;
}

export default function ServiceDetailsModal({
  isOpen,
  onClose,
  service,
  onEdit,
}: ServiceDetailsModalProps) {
  if (!service) return null;

  // Format price as currency
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "Not set";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{service.name}</DialogTitle>
          <DialogDescription>Service details and information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-accent-200" />
            <span className="font-medium">Duration:</span>
            <span className="ml-2">{service.durationMinutes} minutes</span>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-accent-200" />
            <span className="font-medium">Price:</span>
            <span className="ml-2">{formatPrice(service.price)}</span>
          </div>

          <div>
            <div className="font-medium mb-1">Description:</div>
            <p className="text-text-200 whitespace-pre-line">
              {service.description || "No description provided"}
            </p>
          </div>

          <div className="pt-4 border-t border-muted">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-text-200" />
              <span className="text-sm text-text-200">
                Created: {formatDate(service.createdAt)}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-text-200" />
              <span className="text-sm text-text-200">
                Last updated: {formatDate(service.updatedAt)}
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
            Edit Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
