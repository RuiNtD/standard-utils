import type { StandardSchemaV1 as Schema } from "@standard-schema/spec";

import { SchemaError, getDotPath } from "@standard-schema/utils";
export { SchemaError, getDotPath };

export async function validate<T extends Schema>(
  schema: T,
  input: unknown
): Promise<Schema.Result<Schema.InferOutput<T>>> {
  let result = schema["~standard"].validate(input);
  if (result instanceof Promise) result = await result;
  return result;
}
export const safeParse = validate;

export async function parse<T extends Schema>(
  schema: T,
  input: unknown
): Promise<Schema.InferOutput<T>> {
  const result = await validate(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

export function validateSync<T extends Schema>(
  schema: T,
  input: unknown
): Schema.Result<Schema.InferOutput<T>> {
  const result = schema["~standard"].validate(input);
  if (result instanceof Promise)
    throw new TypeError("Schema validation must be synchronous");
  return result;
}
export const safeParseSync = validateSync;

export function parseSync<T extends Schema>(
  schema: T,
  input: unknown
): Schema.InferOutput<T> {
  const result = validateSync(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

export function is<T extends Schema>(
  schema: T,
  input: unknown
): input is Schema.InferOutput<T> {
  const result = validateSync(schema, input);
  return !result.issues;
}

export function assert<T extends Schema>(
  schema: T,
  input: unknown
): input is Schema.InferOutput<T> {
  const result = validateSync(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return true;
}

// Mostly copied from Zod v4's prettifyError
export function formatError(issues: ReadonlyArray<Schema.Issue>): string;
export function formatError(issue: Schema.Issue): string;
export function formatError(result: Schema.FailureResult): string;
export function formatError(
  arg:
    | ReadonlyArray<Schema.Issue>
    | Schema.Issue
    | Schema.FailureResult
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

export class WrappedAsyncSchema<T extends Schema> {
  constructor(public readonly schema: T) {}

  validate = (input: unknown): Promise<Schema.Result<Schema.InferOutput<T>>> =>
    validate(this.schema, input);
  safeParse = this.validate;
  parse = (input: unknown): Promise<Schema.InferOutput<T>> =>
    parse(this.schema, input);
}

export class WrappedSyncSchema<T extends Schema> {
  constructor(public readonly schema: T) {}

  validate = (input: unknown): Schema.Result<Schema.InferOutput<T>> =>
    validateSync(this.schema, input);
  safeParse = this.validate;
  parse = (input: unknown): Schema.InferOutput<T> =>
    parseSync(this.schema, input);

  is = (input: unknown): input is Schema.InferOutput<T> =>
    is(this.schema, input);
  assert = (input: unknown): input is Schema.InferOutput<T> =>
    assert(this.schema, input);
}

export function wrap<T extends Schema>(schema: T): WrappedAsyncSchema<T> {
  return new WrappedAsyncSchema(schema);
}

export function wrapSync<T extends Schema>(schema: T): WrappedSyncSchema<T> {
  return new WrappedSyncSchema(schema);
}
