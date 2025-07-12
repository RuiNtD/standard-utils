import type { StandardSchemaV1 } from "@standard-schema/spec";

import { SchemaError, getDotPath } from "@standard-schema/utils";
export { SchemaError, getDotPath };

export async function validate<T extends StandardSchemaV1>(
  schema: T,
  input: unknown
): Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<T>>> {
  let result = schema["~standard"].validate(input);
  if (result instanceof Promise) result = await result;
  return result;
}
export const safeParse = validate;

export async function parse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown
): Promise<StandardSchemaV1.InferOutput<T>> {
  const result = await validate(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

export function validateSync<T extends StandardSchemaV1>(
  schema: T,
  input: unknown
): StandardSchemaV1.Result<StandardSchemaV1.InferOutput<T>> {
  const result = schema["~standard"].validate(input);
  if (result instanceof Promise)
    throw new TypeError("Schema validation must be synchronous");
  return result;
}
export const safeParseSync = validateSync;

export function parseSync<T extends StandardSchemaV1>(
  schema: T,
  input: unknown
): StandardSchemaV1.InferOutput<T> {
  const result = validateSync(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

export function is<T extends StandardSchemaV1>(
  schema: T,
  input: unknown
): input is StandardSchemaV1.InferOutput<T> {
  const result = validateSync(schema, input);
  return !result.issues;
}

export function assert<T extends StandardSchemaV1>(
  schema: T,
  input: unknown
): input is StandardSchemaV1.InferOutput<T> {
  const result = validateSync(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return true;
}

// Mostly copied from Zod v4's prettifyError
export function formatError(
  issues: ReadonlyArray<StandardSchemaV1.Issue>
): string;
export function formatError(issue: StandardSchemaV1.Issue): string;
export function formatError(result: StandardSchemaV1.FailureResult): string;
export function formatError(
  arg:
    | ReadonlyArray<StandardSchemaV1.Issue>
    | StandardSchemaV1.Issue
    | StandardSchemaV1.FailureResult
    | SchemaError
) {
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

export class WrappedAsyncSchema<T extends StandardSchemaV1> {
  constructor(public readonly schema: T) {}

  validate = (input: unknown) => validate(this.schema, input);
  safeParse = (input: unknown) => safeParse(this.schema, input);
  parse = (input: unknown) => parse(this.schema, input);
}

export class WrappedSyncSchema<T extends StandardSchemaV1> {
  constructor(public readonly schema: T) {}

  validate = (input: unknown) => validateSync(this.schema, input);
  safeParse = (input: unknown) => safeParseSync(this.schema, input);
  parse = (input: unknown) => parseSync(this.schema, input);

  is = (input: unknown): input is StandardSchemaV1.InferOutput<T> =>
    is(this.schema, input);
  assert = (input: unknown): input is StandardSchemaV1.InferOutput<T> =>
    assert(this.schema, input);
}

export function wrap<T extends StandardSchemaV1>(schema: T) {
  return new WrappedAsyncSchema(schema);
}

export function wrapSync<T extends StandardSchemaV1>(schema: T) {
  return new WrappedSyncSchema(schema);
}
