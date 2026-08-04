"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function HodPage() {
  return (
    <ProtectedRoute allowedRoles={["hod", "super_admin"]}>
      <div className="max-w-5xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-white">HoD Dashboard</h1>
        <p className="mt-3 text-gray-400">
          Role-specific access for department-level coordination.
        </p>
      </div>
    </ProtectedRoute>
  );
}
