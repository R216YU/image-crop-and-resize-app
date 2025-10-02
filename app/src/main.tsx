import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import App from "@/App.tsx";
import { theme } from "@/theme/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
