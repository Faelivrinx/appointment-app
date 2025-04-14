// src/types/staff.ts

import { Service } from "@/components/business/services/BusinessServicesPage";

export interface Staff {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  services: Service[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  services: string[]; // Array of service IDs
  profileImage?: string;
}
