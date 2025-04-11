"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Calendar, Clock, History } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-text-100 mb-6">
        Welcome, {user?.firstName}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Book Appointment Card */}
        <Card className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl">
          <div className="h-2 bg-shocking-pink"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center mb-2">
              <Calendar className="h-6 w-6 text-shocking-pink mr-2" />
              <CardTitle>Book Appointment</CardTitle>
            </div>
            <CardDescription className="text-base">
              Schedule a new appointment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-200">
              Choose from available services and select a time that works for
              you.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-shocking-pink hover:bg-shocking-pink-dark text-white"
              asChild
            >
              <Link href="/client/book">Book Now</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl">
          <div className="h-2 bg-accent-200"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center mb-2">
              <Clock className="h-6 w-6 text-accent-200 mr-2" />
              <CardTitle>Upcoming</CardTitle>
            </div>
            <CardDescription className="text-base">
              View your scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-200">
              Review and manage your upcoming appointments.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-accent-200 hover:bg-accent-100 text-white"
              asChild
            >
              <Link href="/client/appointments">View Schedule</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Appointment History */}
        <Card className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl">
          <div className="h-2 bg-cinnamon"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center mb-2">
              <History className="h-6 w-6 text-cinnamon mr-2" />
              <CardTitle>History</CardTitle>
            </div>
            <CardDescription className="text-base">
              View your past appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-200">
              Access your appointment history and previous services.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-cinnamon hover:bg-cinnamon/90 text-white"
              asChild
            >
              <Link href="/client/history">View History</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
