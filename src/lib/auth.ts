// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "mysecret";

const secretKey = new TextEncoder().encode(JWT_SECRET);

// Tạo token
export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretKey);
}

// Xác thực token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload; // object đã decode
  } catch {
    return null;
  }
}
