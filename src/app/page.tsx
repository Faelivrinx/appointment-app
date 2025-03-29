import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, Calendar, Building2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* WIP Banner */}
      <div className="bg-amber-400 text-amber-950 flex items-center justify-center p-3 sticky top-0 z-10">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span className="font-medium">
          This application is currently under development
        </span>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Appointment Scheduler
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
            Effortlessly manage your schedule and business resources with our
            intuitive platform
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <Card className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl">
            <div className="h-2 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <Calendar className="h-6 w-6 text-blue-500 mr-2" />
                <CardTitle>For Clients</CardTitle>
              </div>
              <CardDescription className="text-base">
                Manage your appointments with ease
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center text-slate-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                  Book appointments in real-time
                </li>
                <li className="flex items-center text-slate-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                  View your appointment history
                </li>
                <li className="flex items-center text-slate-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                  Receive email confirmations
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-500 hover:bg-blue-600" asChild>
                <Link href="/client">Schedule Now</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl">
            <div className="h-2 bg-indigo-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <Building2 className="h-6 w-6 text-indigo-500 mr-2" />
                <CardTitle>For Businesses</CardTitle>
              </div>
              <CardDescription className="text-base">
                Streamline your business operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center text-slate-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></div>
                  Manage staff availability
                </li>
                <li className="flex items-center text-slate-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></div>
                  Configure service offerings
                </li>
                <li className="flex items-center text-slate-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></div>
                  View appointment analytics
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-indigo-500 hover:bg-indigo-600"
                asChild
              >
                <Link href="/business">Manage Business</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Feature Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Coming Soon
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            We are working hard to bring you more features, including mobile
            apps, calendar integrations, and advanced analytics.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-800">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Development in Progress
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-slate-500 text-sm">
          <p>
            © {new Date().getFullYear()} Appointment Scheduler. All rights
            reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
