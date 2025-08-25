import type { StandardSchemaV1 as Schema } from "@standard-schema/spec";
export type { Schema };

import { SchemaError, getDotPath } from "@standard-schema/utils";
export { SchemaError, getDotPath };

// Mostly copied from Zod v4's prettifyError
export function formatError(issues: ReadonlyArray<Schema.Issue>): string;
export function formatError(issue: Schema.Issue): string;
export function formatError(result: Schema.FailureResult): string;
export function formatError(error: SchemaError): string;
export function formatError(
  arg:
    | ReadonlyArray<Schema.Issue>
    | Schema.Issue
    | Schema.FailureResult
    | SchemaError
): string {
  // Resolves issues from both FailureResult and SchemaError
  if ("issues" in arg) arg = arg.issues;
  if (!(arg instanceof Array)) arg = [arg];

  return [...arg]
    .sort((a, b) => (a.path?.length ?? -1) - (b.path?.length ?? -1))
    .map((v) => {
      let out = `✖ ${v.message}`;
      const dotPath = getDotPath(v);
      if (dotPath) out += `\n  → at ${dotPath}`;
      return out;
    })
    .join("\n");
}
