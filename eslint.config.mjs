import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

// Next's preset registers the jsx-a11y plugin but only enables a handful of its
// rules. The site has an AA target, so turn on the full recommended set.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{jsx,tsx}"],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  globalIgnores([".next/**", "out/**", "reports/**", "next-env.d.ts"]),
]);
