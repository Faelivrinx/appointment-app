"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Clock, DollarSign, Edit, Trash2, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ServiceModal from "./ServiceModal";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { parseJWT } from "@/services/keycloak";

// Service type definition
export interface Service {
  id: string;
  businessId: string;
  name: string;
  durationMinutes: number;
  description?: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

export default function BusinessServicesPage() {
  const { accessToken, isAuthenticated, hasRole } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  // Extract business ID from token
  useEffect(() => {
    if (accessToken) {
      try {
        const decodedToken = parseJWT(accessToken);
        // Assuming the business ID is available in the JWT token
        const businessIdFromToken = decodedToken.business_id;
        if (businessIdFromToken) {
          setBusinessId(businessIdFromToken);
        } else {
          setError(
            "Business ID not found in your account. Please contact support.",
          );
        }
      } catch (error) {
        console.error("Error parsing JWT token:", error);
        setError("Could not authenticate business account.");
      }
    }
  }, [accessToken]);

  // Fetch services when businessId is available
  useEffect(() => {
    if (businessId && isAuthenticated) {
      fetchServices();
    }
  }, [businessId, isAuthenticated]);

  // Fetch services from API
  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!accessToken) {
        throw new Error("No authentication token");
      }

      const response = await fetch(
        `http://localhost:8081/api/businesses/${businessId}/services`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error fetching services: ${response.statusText}`);
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch services",
      );
      toast.error("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a service
  const handleDeleteService = async (serviceId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/businesses/${businessId}/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error deleting service: ${response.statusText}`);
      }

      // Remove the service from the state
      setServices(services.filter((service) => service.id !== serviceId));
      toast.success("Service deleted successfully");
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Failed to delete service. Please try again.");
    }
  };

  // Handle opening the edit modal
  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  // Handle opening the view modal
  const handleViewService = (service: Service) => {
    setCurrentService(service);
    setIsViewModalOpen(true);
  };

  // Handle adding a new service
  const handleAddService = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  // Handle service save (create or update)
  const handleServiceSave = async (serviceData: Partial<Service>) => {
    try {
      let response;

      if (currentService) {
        // Update existing service
        response = await fetch(
          `http://localhost:8081/api/businesses/${businessId}/services/${currentService.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(serviceData),
          },
        );
      } else {
        // Create new service
        response = await fetch(
          `http://localhost:8081/api/businesses/${businessId}/services`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(serviceData),
          },
        );
      }

      if (!response.ok) {
        throw new Error(
          `Error ${currentService ? "updating" : "creating"} service: ${response.statusText}`,
        );
      }

      const updatedService = await response.json();

      if (currentService) {
        // Update existing service in the list
        setServices(
          services.map((service) =>
            service.id === updatedService.id ? updatedService : service,
          ),
        );
        toast.success("Service updated successfully");
      } else {
        // Add new service to the list
        setServices([...services, updatedService]);
        toast.success("Service created successfully");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save service:", error);
      toast.error(
        `Failed to ${currentService ? "update" : "create"} service. Please try again.`,
      );
    }
  };

  // Format price as currency
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "Not set";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Loading services...</span>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={["business"]}>
      <div className="min-h-screen bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-100">
                Services Management
              </h1>
              <p className="text-text-200 mt-1">
                Manage the services your business offers to clients
              </p>
            </div>
            <Button
              className="mt-4 sm:mt-0 bg-accent-200 hover:bg-accent-100 text-white flex items-center"
              onClick={handleAddService}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </div>

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {services.length === 0 && !loading && !error ? (
            <Card className="text-center p-8">
              <CardContent>
                <p className="text-text-200 mb-4">
                  You haven't added any services yet.
                </p>
                <Button
                  className="bg-accent-200 hover:bg-accent-100 text-white"
                  onClick={handleAddService}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-2 bg-accent-200"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-text-200" />
                      {service.durationMinutes} minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-text-200 line-clamp-2">
                        {service.description || "No description provided"}
                      </p>
                    </div>
                    <p className="font-medium flex items-center text-accent-200">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatPrice(service.price)}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center"
                      onClick={() => handleViewService(service)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center text-amber-600 border-amber-200 hover:bg-amber-50"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Service</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the service "
                            {service.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Service Edit/Create Modal */}
        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleServiceSave}
          service={currentService}
        />

        {/* Service View Details Modal */}
        <ServiceDetailsModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          service={currentService}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsModalOpen(true);
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
