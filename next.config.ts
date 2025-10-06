import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/create",
        destination: "/snippets/new",
      },
      {
        source: "/my-snippets",
        destination: "/snippets/me",
      },
      {
        source: "/",
        destination: "/dashboard",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
