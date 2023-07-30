import type { CodegenConfig } from "@graphql-codegen/cli";
import { printSchema } from "graphql";

import { schema } from "./app/gql/schema";

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ["app/**/*.gql"],
  generates: {
    "app/gql/types.ts": { plugins: ["typescript"] },
    "app/": {
      preset: "near-operation-file",
      presetConfig: {
        extension: ".tsx",
        baseTypesPath: "gql/types.ts",
      },
      plugins: ["typescript-operations", "typescript-react-apollo"],
    },
  },
};

export default config;
