// server/prisma/seedAdmin.js
//
// One-off bootstrap script. Now that POST /api/auth/register requires an
// existing admin to call it, there's a chicken-and-egg problem for the very
// first admin account — nobody can call the API to create it, since nobody
// is an admin yet. This script creates that first admin directly via Prisma,
// bypassing the API entirely.
//
// Run once, from the server/ directory:
//   node prisma/seedAdmin.js
//
// Safe to re-run: it checks for an existing admin with the same phone/email
// first and does nothing if one already exists, so it won't create
// duplicates if run again by accident.
import "dotenv/config";
import prisma from "../src/lib/prisma.js";
import { hashPassword } from "../src/auth/hash.js";

// EDIT THESE before running, then consider deleting this file's credentials
// (or at least changing the password immediately after first login).
const ADMIN = {
  fullName: "Admin",
  email: "admin@example.com",
  phone: "9999999999", // 10-digit; normalized to 91XXXXXXXXXX same as any other user
  password: "123456", // CHANGE THIS after first login via Profile > Change Password
};

function normalizePhone(rawPhone) {
  const digits = String(rawPhone || "").replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

async function main() {
  const normalizedPhone = normalizePhone(ADMIN.phone);

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: ADMIN.email }, { phone: normalizedPhone }] },
  });

  if (existing) {
    console.log(
      `An account already exists with this email or phone (role: ${existing.role}). ` +
      `Nothing created. If you need another admin, use the Admin > Staff Accounts page ` +
      `once logged in, instead of re-running this script.`
    );
    return;
  }

  const hashed = await hashPassword(ADMIN.password);

  const admin = await prisma.user.create({
    data: {
      fullName: ADMIN.fullName,
      email: ADMIN.email,
      phone: normalizedPhone,
      password: hashed,
      role: "ADMIN",
      modules: [], // admins aren't assigned modules — requireModule bypasses this check for ADMIN role
    },
  });

  console.log("Admin account created:");
  console.log(`  Phone: ${ADMIN.phone} (login with this)`);
  console.log(`  Password: ${ADMIN.password}`);
  console.log(`  User ID: ${admin.id}`);
  console.log("\nLog in, then change this password immediately from Profile > Change Password.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });