import type { AppProps } from "next/app";
import NextProgress from "nextjs-progressbar";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <NextProgress color="tomato" />
            <Component {...pageProps} />
        </>
    );
}
