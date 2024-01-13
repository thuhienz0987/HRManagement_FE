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

        // form attendance
        if (
            request.nextUrl.pathname == "/attendance/form" &&
            !request.nextauth.token?.roles.includes(process.env.HRManager)
        ) {
            return NextResponse.rewrite(new URL("/denied", request.url));
        }

        //daily
        if (
            request.nextUrl.pathname == "/attendance/daily" &&
            !(
                request.nextauth.token?.roles.includes(process.env.HRManager) ||
                request.nextauth.token?.roles.includes(process.env.CEO) ||
                request.nextauth.token?.roles.includes(
                    process.env.DepartmentManager
                ) ||
                request.nextauth.token?.roles.includes(process.env.TeamManager)
            )
        ) {
            return NextResponse.rewrite(new URL("/denied", request.url));
        }

        // absent
        // if (
        //   request.nextUrl.pathname == "/attendance/absent" &&
        //   !request.nextauth.token?.roles.includes(process.env.HRManager)
        // ) {
        //   return NextResponse.rewrite(new URL("/denied", request.url));
        // }

        //employee-list
        if (
            request.nextUrl.pathname == "/employee/employee-list" &&
            !(
                request.nextauth.token?.roles.includes(process.env.HRManager) ||
                request.nextauth.token?.roles.includes(process.env.CEO)
            )
        ) {
            return NextResponse.rewrite(new URL("/denied", request.url));
        }

        //add-employee
        if (
            request.nextUrl.pathname == "/employee/add-employee" &&
            !request.nextauth.token?.roles.includes(process.env.HRManager)
        ) {
            return NextResponse.rewrite(new URL("/denied", request.url));
        }

        // comment form
        if (
            request.nextUrl.pathname == "/performance-rate/comment-form" &&
            !(
                request.nextauth.token?.roles.includes(process.env.HRManager) ||
                request.nextauth.token?.roles.includes(process.env.CEO) ||
                request.nextauth.token?.roles.includes(
                    process.env.DepartmentManager
                ) ||
                request.nextauth.token?.roles.includes(process.env.TeamManager)
            )
        ) {
            return NextResponse.rewrite(new URL("/denied", request.url));
        }

        // edit profile
        if (
            request.nextUrl.pathname == "/account/edit-profile" &&
            !request.nextauth.token?.roles.includes(process.env.HRManager)
        ) {
            return NextResponse.rewrite(new URL("/denied", request.url));
        }

        //
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

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|forgotPassword|resetPassword).*)",
    ],
};
