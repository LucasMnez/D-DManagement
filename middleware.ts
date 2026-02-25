import { withAuth } from "next-auth/middleware";

export default withAuth(
  () => {
    return;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        if (!token) {
          return false;
        }

        if (pathname.startsWith("/admin")) {
          return token.role === "ADMIN";
        }

        if (pathname.startsWith("/painel")) {
          return token.role === "PLAYER" || token.role === "ADMIN";
        }

        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/painel/:path*", "/admin/:path*"]
};
