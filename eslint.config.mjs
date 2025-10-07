import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "import": importPlugin,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^node:"],
            ["^react", "^next"],
            ["^@?\\w"], // external packages (third-party libraries)
            ["^@/"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"], // relative imports starting with ../
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"], // relative imports starting with ./
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // additional import rules
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off", // turn off as Next.js handles module resolution
      "import/order": "off", // we use simple-import-sort instead
    },
  },
];

export default config;