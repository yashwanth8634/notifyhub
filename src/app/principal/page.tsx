"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function PrincipalPage() {
  return (
    <ProtectedRoute allowedRoles={["principal", "super_admin"]}>
      <div className="max-w-5xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-white">Principal Dashboard</h1>
        <p className="mt-3 text-gray-400">
          Role-specific access for principal-level oversight.
        </p>
      </div>
    </ProtectedRoute>
  );
}
