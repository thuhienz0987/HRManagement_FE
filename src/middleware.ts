import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(request: NextRequestWithAuth) {
        // if (
        //     request.nextUrl.pathname == ("/attendance/absent") &&
        //     !(request.nextauth.token?.roles.includes(process.env.HRManager)
        //     || request.nextauth.token?.roles.includes(process.env.CEO))
        // ) {
        //     return NextResponse.rewrite(new URL("/denied", request.url));
        // }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/signIn",
        },
    }
);
