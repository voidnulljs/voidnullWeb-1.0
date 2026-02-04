import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <link href="https://pro.fontawesome.com/releases/v6.0.0-beta1/css/all.css" rel="stylesheet" />
                <link rel="stylesheet" href="/css/nprogress.css" />
                <meta name="robots" content="index,follow" />
                <meta name="googlebot" content="index,follow" />
                <meta
	                name="description"
	                content="Full-Stack Developer and PolyGlot Developer"
                />
                <meta property="og:url" content="https://voidnull.vercel.app" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="voidnull" />
                <meta
	                property="og:description"
	                content="Full-Stack Developer and PolyGlot Developer"
                />
                <meta property="og:image:alt" content="voidnull.vercel.app" />
                <meta property="og:locale" content="en_GB" />
                <meta name="theme-color" content="#e1a908" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};
