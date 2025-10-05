import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log("📡 Connecting to MongoDB...");
    await dbConnect();
    console.log("✅ Connected!");
    // check email tồn tại
    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword:", hashedPassword);

    const newUser = new User({
      email,
      passwordHash: hashedPassword,
      name,
    });
    console.log("newUser:", newUser);

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
