import { Html, Head, Main, NextScript } from "next/document";
import { StyledEngineProvider } from "@mui/material/styles";

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <StyledEngineProvider injectFirst>
                    <Main />
                    <NextScript />
                </StyledEngineProvider>
            </body>
        </Html>
    );
}
