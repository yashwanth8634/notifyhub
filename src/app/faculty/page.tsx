"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FacultyPage() {
  return (
    <ProtectedRoute allowedRoles={["faculty", "super_admin"]}>
      <div className="max-w-5xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-white">Faculty Dashboard</h1>
        <p className="mt-3 text-gray-400">
          Role-specific access for faculty-level updates.
        </p>
      </div>
    </ProtectedRoute>
  );
}
