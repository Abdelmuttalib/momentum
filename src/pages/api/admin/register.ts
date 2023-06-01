/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// api/admin/register.js

import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Destructure the phoneNumber and password from the request body
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { organization, phoneNumber, first_name, last_name, email, password } =
    req.body;

  // Check if the phoneNumber and password are provided
  if (!phoneNumber || !password) {
    return res
      .status(400)
      .json({ message: "Phone number and Password are required" });
  }

  // Check if user already exists in Prisma
  const existingUser = await prisma.user.findUnique({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      phoneNumber: phoneNumber,
    },
  });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const saltRounds = 10;
  // Hash the password
  const hashedPassword = await bcrypt.hash(password as string, saltRounds);

  try {
    // Create a new user in Supabase

    // Create a new user in Prisma
    const prismaUser = await prisma.user.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        phoneNumber: phoneNumber,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        firstName: first_name,
        lastName: last_name,
        organization,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email: email,
        password: hashedPassword,
      },
    });

    return res.status(201).json(prismaUser);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default handler;
