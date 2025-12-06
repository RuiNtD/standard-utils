import type { StandardSchemaV1 as S } from "@standard-schema/spec";
export type { S as StandardSchemaV1 };

import { SchemaError, getDotPath } from "@standard-schema/utils";
export { SchemaError, getDotPath };

export type Result<Output> = SuccessResult<Output> | FailureResult;
export type SuccessResult<Output> = S.SuccessResult<Output> & {
  readonly success: true;
};
export type FailureResult = S.FailureResult & {
  readonly success: false;
};

export function convertResult<Output>(
  result: S.Result<Output>,
): Result<Output> {
  return !result.issues
    ? {
        success: true,
        value: result.value,
      }
    : {
        success: false,
        issues: result.issues,
      };
}

// Mostly copied from Zod v4's prettifyError
export function prettifyError(issues: ReadonlyArray<S.Issue>): string;
export function prettifyError(issue: S.Issue): string;
export function prettifyError(result: S.FailureResult): string;
export function prettifyError(error: SchemaError): string;
export function prettifyError(
  arg: ReadonlyArray<S.Issue> | S.Issue | S.FailureResult | SchemaError,
): string {
  // Resolves issues from both FailureResult and SchemaError
  if ("issues" in arg) arg = arg.issues;
  if (!(arg instanceof Array)) arg = [arg];

  const lines: string[] = [];
  // sort by path length
  const issues = [...arg].sort(
    (a, b) => (a.path ?? []).length - (b.path ?? []).length,
  );

  // Process each issue
  for (const issue of issues) {
    lines.push(`✖ ${issue.message}`);
    const dotPath = getDotPath(issue);
    if (dotPath) lines.push(`  → at ${dotPath}`);
  }

  // Convert Map to formatted string
  return lines.join("\n");
}
