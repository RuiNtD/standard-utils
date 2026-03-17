import type { StandardSchemaV1 } from "@standard-schema/spec";
export type { StandardSchemaV1 };

import { SchemaError, getDotPath } from "@standard-schema/utils";
export { SchemaError, getDotPath };

/** A {@linkcode StandardSchemaV1.Result} with a success field. */
export type Result<Output> = SuccessResult<Output> | FailureResult;
/** A {@linkcode StandardSchemaV1.SuccessResult} with a success field. */
export interface SuccessResult<
  Output,
> extends StandardSchemaV1.SuccessResult<Output> {
  readonly success: true;
}
/** A {@linkcode StandardSchemaV1.FailureResult} with a success field. */
export interface FailureResult extends StandardSchemaV1.FailureResult {
  readonly success: false;
}

/** Adds a success field to {@linkcode result}. */
export function convertResult<Output>(
  result: StandardSchemaV1.Result<Output>,
): Result<Output> {
  return !result.issues
    ? { success: true, value: result.value }
    : { success: false, issues: result.issues };
}

/**
 * Takes a `FailureResult` (from `validate`), `Issue[]` (from `FailureResult.issues`), a single `Issue`, or a {@link SchemaError}; and returns a user-friendly error message.
 *
 * Mostly copied from {@link https://github.com/colinhacks/zod/blob/7d98c909329713cb2f478620f8a67aaf3ef40ce2/packages/zod/src/v4/core/errors.ts#L435 Zod v4's prettifyError}
 *
 * @summary Returns a user-friendly error message.
 */
export function prettifyError(
  issues: ReadonlyArray<StandardSchemaV1.Issue>,
): string;
export function prettifyError(issue: StandardSchemaV1.Issue): string;
export function prettifyError(result: StandardSchemaV1.FailureResult): string;
export function prettifyError(error: SchemaError): string;
export function prettifyError(
  error:
    | ReadonlyArray<StandardSchemaV1.Issue>
    | StandardSchemaV1.Issue
    | StandardSchemaV1.FailureResult
    | SchemaError,
): string {
  // Resolves issues from both FailureResult and SchemaError
  if ("issues" in error) error = error.issues;
  if (!(error instanceof Array)) error = [error];

  const lines: string[] = [];
  // sort by path length
  const issues = [...error].sort(
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
