"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const user = await getCurrentUser();
  
  let notifications: any[] = [];
  if (user) {
    notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }

  return <NavbarClient user={user} initialNotifications={notifications} />;
}
