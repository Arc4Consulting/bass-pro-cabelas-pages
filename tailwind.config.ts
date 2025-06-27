import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";
import { ButtonConfig, HeadingConfig, LinkConfig } from "./tailwind";
import { styleguidePlugin } from "./tailwindPlugin";

export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@yext/search-ui-react/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: "'Bebas','Helvetica','sans-serif','system'",
        secondary: "'Cabin','Helvetica','sans-serif','system'",
        tertiary: "'Opensans','Helvetica','sans-serif','system'",
      },
      fontSize: {
        xs: ["12px", "14px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        local: ["18px", "20px"],
        lg: ["18px", "24px"],
        xl: ["24px", "24px"],
      },
      colors: {
        text: "black",
        black: "#000",
        "brand-primary": "#1E8000",
        "brand-secondary": "#084D32",
        "brand-green": {
          100: "#616630",
          200: "#3f4519",
          300: "#213629",
          400: "#4A5A50",
          500: "#1F8500",
          600: "#186700",
        },
        "brand-blue": {
          100: "#358aee",
          200: "#0065d1",
          300: "#002b49",
          400: "#00263e",
          500: "#0058a0",
        },
        "brand-red": {
          100: "#f5c7c7",
          200: "#8b0f0a",
          300: "#bb3030",
          400: "#8b0f0a",
        },
        "brand-orange": "#cc5500",
        "brand-link-blue": "#0000EE",
        "brand-burnt-orange": "#9D3D1C",
        "brand-yellow": "#f8Bf00",
        "brand-gold": "#b26100",
        "brand-gray": {
          100: "#f5f4f1",
          200: "#ebebeb",
          300: "#d4d4d4",
          400: "#878787",
          500: "#656464",
          600: "#1e1d19",
          700: "#424242",
          800: "#ccc",
          900: "#222",
          1000: "#eee",
          1100: "#F2EEE3",
        },
        "brand-nearby": "#F2EEE3",
      },
      buttons: (theme: PluginAPI["theme"]): ButtonConfig => ({
        fontFamily: theme("fontFamily.secondary"),
        textTransform: "uppercase",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
        variants: {
          primary: {
            backgroundColor: theme("colors.brand-green.300"),
            color: "white",
            border: `2px solid ${theme("colors.brand-green.300")}`,
            "&:hover": {
              backgroundColor: theme("colors.brand-green.400"),
              border: `2px solid ${theme("colors.brand-green.400")}`,
            },
          },
          primaryCabelas: {
            backgroundColor: theme("colors.brand-green.100"),
            color: "white",
            border: `2px solid ${theme("colors.brand-green.100")}`,
            "&:hover": {
              backgroundColor: theme("colors.brand-green.200"),
              border: `2px solid ${theme("colors.brand-green.200")}`,
            },
          },
          secondary: {
            backgroundColor: "white",
            color: theme("colors.brand-green.400"),
            border: `2px solid ${theme("colors.brand-green.400")}`,
            "&:hover": {
              backgroundColor: theme("colors.brand-green.400"),
              border: `2px solid ${theme("colors.brand-green.400")}`,
              color: "white",
            },
          },
          secondaryCabelas: {
            backgroundColor: "white",
            color: theme("colors.brand-green.200"),
            border: `2px solid ${theme("colors.brand-green.200")}`,
            "&:hover": {
              backgroundColor: theme("colors.brand-green.100"),
              border: `2px solid ${theme("colors.brand-green.100")}`,
              color: "white",
            },
          },
          employment: {
            backgroundColor: "white",
            color: theme("colors.brand-green.300"),
            border: `2px solid white`,
            "&:hover": {
              backgroundColor: "transparent",
              color: "white",
            },
          },
        },
      }),
      headings: (theme: PluginAPI["theme"]): HeadingConfig => ({
        fontFamily: theme("fontFamily.primary"),
        letterSpacing: "1.5px",
        variants: {
          sub: {
            fontSize: "18px",
            lineHeight: "20px",
            "@screen sm": {
              fontSize: "24px",
              lineHeight: "24px",
            },
          },
          head: {
            fontSize: "24px",
            lineHeight: "24px",
            "@screen sm": {
              fontSize: "33px",
              lineHeight: "34px",
            },
          },
          lead: {
            fontSize: "33px",
            lineHeight: "33px",
            "@screen sm": {
              fontSize: "64px",
              lineHeight: "56px",
            },
          },
          large: {
            fontSize: "32px",
            lineHeight: "36px",
            "@screen sm": {
              fontSize: "42px",
              lineHeight: "46px",
            },
          },
          secondary: {
            fontSize: "24px",
            lineHeight: "32px",
            letterSpacing: "unset",
            fontFamily: theme("fontFamily.secondary"),
            fontWeight: theme("fontWeight.bold"),
            textTransform: "uppercase",
            "@screen sm": {
              fontSize: "28px",
              lineHeight: "48px",
            },
          },
        },
      }),
      links: (theme: PluginAPI["theme"]): LinkConfig => ({
        variants: {
          header: {
            fontSize: "18px",
            lineHeight: "28px",
          },
          primary: {
            color: theme("colors.brand-primary"),
            "&:hover": {
              color: theme("colors.brand-secondary"),
            },
          },
          breadcrumbs: {
            fontFamily: theme("fontFamily.secondary"),
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: theme("fontWeight.bold"),
            textDecoration: "underline",
          },
          underline: {
            textDecoration: "underline",
            "&:hover": {
              textDecoration: "none",
            },
          },
          underlineInverse: {
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        },
      }),
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
      boxShadow: {
        "brand-shadow": "0 -1px 0 0 #CCC inset",
        "box-shadow": "0 2px 7px 1px rgba(0,0,0,.3)",
        "search-shadow": "0 4px 2px 2px rgba(0,0,0,.15)",
        "card-shadow": "0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24)",
        "card-hover": "0 3px 6px rgba(0,0,0,.16), 0 3px 6px rgba(0,0,0,.23)",
      },
      backgroundImage: {
        "employment-image": "url('/src/assets/images/promo-background.jpeg')",
      },
      content: {
        search: "url('/src/assets/images/search.svg')",
      },
    },
  },
  plugins: [styleguidePlugin()],
} as Config;
