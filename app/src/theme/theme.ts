import { createSystem, defaultConfig } from "@chakra-ui/react";

export const theme = createSystem({
  ...defaultConfig,
  globalCss: {
    body: {
      colorScheme: "light",
    },
    ":root": {
      "--chakra-ui-color-mode": "light",
    },
  },
});
