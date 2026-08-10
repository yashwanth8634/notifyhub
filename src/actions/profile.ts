"use server";

import { getSession } from "@/config/auth";
import { userModel } from "@/models/userModel";
import { authService } from "@/services/authService";

export async function getProfile() {
  const user = await getSession();
  if (!user) throw new Error("UNAUTHORIZED");
  
  const dbUser = await userModel.findById(user.id);
  if (!dbUser) throw new Error("NOT_FOUND");
  
  return {
    name: dbUser.name,
    email: dbUser.email,
  };
}

export async function updateProfile(data: { name?: string; email?: string; password?: string }) {
  const user = await getSession();
  if (!user) throw new Error("UNAUTHORIZED");

  // Check if they are updating password
  if (data.password) {
    const hash = await authService.hashPassword(data.password);
    await userModel.updatePassword(user.id, hash);
  }

  // Update name and email if provided
  await userModel.updateProfile(user.id, {
    name: data.name,
    email: data.email,
  });

  return { success: true };
}
