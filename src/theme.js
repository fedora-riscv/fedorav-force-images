import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react";

// Heading recipe matching Chakra UI v2 size mapping
const headingRecipe = defineRecipe({
  className: "chakra-heading",
  base: {
    fontFamily: "heading",
    fontWeight: "bold",
  },
  variants: {
    size: {
      "4xl": { fontSize: "7xl", lineHeight: 1 },
      "3xl": { fontSize: "6xl", lineHeight: 1 },
      "2xl": { fontSize: "5xl", lineHeight: 1.2 },
      xl: { fontSize: "4xl", lineHeight: 1.2 },
      lg: { fontSize: "3xl", lineHeight: 1.33 },
      md: { fontSize: "xl", lineHeight: 1.2 },
      sm: { fontSize: "md", lineHeight: 1.2 },
      xs: { fontSize: "sm", lineHeight: 1.2 },
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

// Badge recipe matching Chakra UI v2 defaults
const badgeRecipe = defineRecipe({
  className: "chakra-badge",
  base: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: "xs",
    borderRadius: "sm",
    px: "1",
  },
  variants: {
    variant: {
      solid: {},
      subtle: {},
      outline: {
        borderWidth: "1px",
      },
    },
    size: {
      sm: { fontSize: "xs", px: "1" },
      md: { fontSize: "xs", px: "2" },
      lg: { fontSize: "sm", px: "2" },
    },
  },
  defaultVariants: {
    variant: "subtle",
    size: "sm",
  },
});

// Custom system matching Chakra UI v2 default theme tokens
const config = defineConfig({
  theme: {
    recipes: {
      heading: headingRecipe,
      badge: badgeRecipe,
    },
    tokens: {
      fonts: {
        body: { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' },
        heading: { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
        "5xl": { value: "3rem" },
        "6xl": { value: "3.75rem" },
        "7xl": { value: "4.5rem" },
        "8xl": { value: "6rem" },
        "9xl": { value: "8rem" },
      },
      colors: {
        // Chakra UI v2 color palette
        gray: {
          50: { value: "#F7FAFC" },
          100: { value: "#EDF2F7" },
          200: { value: "#E2E8F0" },
          300: { value: "#CBD5E0" },
          400: { value: "#A0AEC0" },
          500: { value: "#718096" },
          600: { value: "#4A5568" },
          700: { value: "#2D3748" },
          800: { value: "#1A202C" },
          900: { value: "#171923" },
        },
        blue: {
          50: { value: "#EBF8FF" },
          100: { value: "#BEE3F8" },
          200: { value: "#90CDF4" },
          300: { value: "#63B3ED" },
          400: { value: "#4299E1" },
          500: { value: "#3182CE" },
          600: { value: "#2B6CB0" },
          700: { value: "#2C5282" },
          800: { value: "#2A4365" },
          900: { value: "#1A365D" },
        },
        green: {
          50: { value: "#F0FFF4" },
          100: { value: "#C6F6D5" },
          200: { value: "#9AE6B4" },
          300: { value: "#68D391" },
          400: { value: "#48BB78" },
          500: { value: "#38A169" },
          600: { value: "#2F855A" },
          700: { value: "#276749" },
          800: { value: "#22543D" },
          900: { value: "#1C4532" },
        },
        teal: {
          50: { value: "#E6FFFA" },
          100: { value: "#B2F5EA" },
          200: { value: "#81E6D9" },
          300: { value: "#4FD1C5" },
          400: { value: "#38B2AC" },
          500: { value: "#319795" },
          600: { value: "#2C7A7B" },
          700: { value: "#285E61" },
          800: { value: "#234E52" },
          900: { value: "#1D4044" },
        },
        orange: {
          50: { value: "#FFFAF0" },
          100: { value: "#FEEBC8" },
          200: { value: "#FBD38D" },
          300: { value: "#F6AD55" },
          400: { value: "#ED8936" },
          500: { value: "#DD6B20" },
          600: { value: "#C05621" },
          700: { value: "#9C4221" },
          800: { value: "#7B341E" },
          900: { value: "#652B19" },
        },
        purple: {
          50: { value: "#FAF5FF" },
          100: { value: "#E9D8FD" },
          200: { value: "#D6BCFA" },
          300: { value: "#B794F4" },
          400: { value: "#9F7AEA" },
          500: { value: "#805AD5" },
          600: { value: "#6B46C1" },
          700: { value: "#553C9A" },
          800: { value: "#44337A" },
          900: { value: "#322659" },
        },
        red: {
          50: { value: "#FFF5F5" },
          100: { value: "#FED7D7" },
          200: { value: "#FEB2B2" },
          300: { value: "#FC8181" },
          400: { value: "#F56565" },
          500: { value: "#E53E3E" },
          600: { value: "#C53030" },
          700: { value: "#9B2C2C" },
          800: { value: "#822727" },
          900: { value: "#63171B" },
        },
        yellow: {
          50: { value: "#FFFFF0" },
          100: { value: "#FEFCBF" },
          200: { value: "#FAF089" },
          300: { value: "#F6E05E" },
          400: { value: "#ECC94B" },
          500: { value: "#D69E2E" },
          600: { value: "#B7791F" },
          700: { value: "#975A16" },
          800: { value: "#744210" },
          900: { value: "#5F370E" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
