import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // tạo JWT token
    const token = await signToken({ id: user._id.toString(), email: user.email });

    // set token vào cookie
    const res = NextResponse.json({
      message: "Login successful",
      user: { email: user.email, name: user.name, id: user._id},
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
