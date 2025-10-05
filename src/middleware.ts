import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Nếu user đã login thì chặn vào login/register
  if ((pathname === "/login" || pathname === "/register" || pathname === "/")  && token) {
    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)
      );
      console.log("Verifying token in 1");

      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (err) {
      // token hết hạn thì cho vào login lại
      console.log(err);
    }
  }

  // Nếu vào /dashboard thì bắt buộc cần token
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)
      );
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
export default createMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "en",
});
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/login",
    "/register",
    "/snippets",
    "/create",
    "/my-snippets",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
