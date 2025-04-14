"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Mail, Phone, Trash2, Edit, Eye, UserPlus } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { parseJWT } from "@/services/keycloak";
import { useRedirect } from "@/hooks/useRedirect";
import { Staff } from "@/types/staff";
import { Service } from "@/components/business/services/BusinessServicesPage";
import StaffModal from "@/components/business/staff/StaffModal";
import StaffDetailsModal from "@/components/business/staff/StaffDetailsModal";

export default function BusinessStaffPage() {
  const { accessChecked, isLoading: redirectLoading } = useRedirect({
    onlyAuthenticated: true,
    requiredRoles: ["BUSINESS_OWNER"],
  });

  const { accessToken, isAuthenticated } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
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

  // Fetch staff and services when businessId is available
  useEffect(() => {
    if (businessId && isAuthenticated && accessChecked) {
      // In a real app, these would be API calls
      fetchServices();
      fetchStaff();
    }
  }, [businessId, isAuthenticated, accessChecked]);

  // Fetch services function - will be implemented when API is available
  const fetchServices = async () => {
    // This would be an API call in a real app
    // Example: GET /api/businesses/{businessId}/services
    setServices([]);
    // Set loading state to false after API call
    setLoading(false);
  };

  // Fetch staff function - will be implemented when API is available
  const fetchStaff = async () => {
    setLoading(true);
    setError(null);

    try {
      // This would be an API call in a real app
      // Example: GET /api/businesses/{businessId}/staff

      // For now, initialize with empty array
      setStaff([]);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch staff",
      );
      toast.error("Failed to load staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete staff function - will be implemented when API is available
  const handleDeleteStaff = async (staffId: string) => {
    try {
      // This would be an API call in a real app
      // Example: DELETE /api/businesses/{businessId}/staff/{staffId}

      // Remove the staff member from the state
      setStaff(staff.filter((s) => s.id !== staffId));
      toast.success("Staff member removed successfully");
    } catch (error) {
      console.error("Failed to delete staff:", error);
      toast.error("Failed to remove staff member. Please try again.");
    }
  };

  // Handle opening the edit modal
  const handleEditStaff = (staffMember: Staff) => {
    setCurrentStaff(staffMember);
    setIsModalOpen(true);
  };

  // Handle opening the view modal
  const handleViewStaff = (staffMember: Staff) => {
    setCurrentStaff(staffMember);
    setIsViewModalOpen(true);
  };

  // Handle adding a new staff member
  const handleAddStaff = () => {
    setCurrentStaff(null);
    setIsModalOpen(true);
  };

  // Handle staff save (create or update) - will be implemented when API is available
  const handleStaffSave = async (staffData: any) => {
    try {
      if (currentStaff) {
        // This would update an existing staff member via API
        // Example: PUT /api/businesses/{businessId}/staff/{staffId}
        toast.success("Staff member updated successfully");
      } else {
        // This would create a new staff member via API
        // Example: POST /api/businesses/{businessId}/staff
        toast.success("Staff member added successfully");
      }

      setIsModalOpen(false);

      // Reload staff data
      fetchStaff();
    } catch (error) {
      console.error("Failed to save staff:", error);
      toast.error(
        `Failed to ${currentStaff ? "update" : "add"} staff member. Please try again.`,
      );
    }
  };

  // Show loading state during redirects or initial data loading
  if (redirectLoading || !accessChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Checking access...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Loading staff...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-lightest via-white to-shocking-pink-light/10 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-100">
              Staff Management
            </h1>
            <p className="text-text-200 mt-1">
              Manage your business staff and their service assignments
            </p>
          </div>
          <Button
            className="mt-4 sm:mt-0 bg-accent-200 hover:bg-accent-100 text-white flex items-center"
            onClick={handleAddStaff}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Staff
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {staff.length === 0 && !loading && !error ? (
          <Card className="text-center p-8">
            <CardContent>
              <p className="text-text-200 mb-4">
                You haven't added any staff members yet.
              </p>
              <Button
                className="bg-accent-200 hover:bg-accent-100 text-white"
                onClick={handleAddStaff}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Your First Staff Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((staffMember) => (
              <Card
                key={staffMember.id}
                className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-2 bg-accent-200"></div>
                <CardHeader className="pb-2 flex flex-row items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={
                        staffMember.profileImage || "/api/placeholder/128/128"
                      }
                      alt={staffMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {staffMember.name}
                    </CardTitle>
                    <div className="flex items-center text-text-200 text-sm mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {staffMember.email}
                    </div>
                    <div className="flex items-center text-text-200 text-sm mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {staffMember.phone}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    {staffMember.services.map((service) => (
                      <span
                        key={service.id}
                        className="text-xs px-2 py-1 bg-accent-100/20 text-accent-200 rounded-full"
                      >
                        {service.name}
                      </span>
                    ))}
                    {staffMember.services.length === 0 && (
                      <span className="text-xs text-text-200">
                        No services assigned
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                    onClick={() => handleViewStaff(staffMember)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center text-amber-600 border-amber-200 hover:bg-amber-50"
                    onClick={() => handleEditStaff(staffMember)}
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
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Staff Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {staffMember.name}{" "}
                          from your staff? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDeleteStaff(staffMember.id)}
                        >
                          Remove
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

      {/* Staff Edit/Create Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleStaffSave}
        staff={currentStaff}
        services={services}
      />

      {/* Staff View Details Modal */}
      <StaffDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        staff={currentStaff}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
