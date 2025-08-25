import { type Schema, SchemaError } from "./helpers.ts";

export function validate<T extends Schema>(
  schema: T,
  input: unknown
): Schema.Result<Schema.InferOutput<T>> {
  const result = schema["~standard"].validate(input);
  if (result instanceof Promise)
    throw new TypeError("Schema validation must be synchronous");
  return result;
}
export const safeParse = validate;

export function parse<T extends Schema>(
  schema: T,
  input: unknown
): Schema.InferOutput<T> {
  const result = validate(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

export const decode = <T extends Schema>(
  schema: T,
  input: Schema.InferInput<T>
): Schema.InferOutput<T> => parse(schema, input);

export function is<T extends Schema>(
  schema: T,
  input: unknown
): input is Schema.InferOutput<T> {
  return !validate(schema, input).issues;
}

export function assert<T extends Schema>(
  schema: T,
  input: unknown
): asserts input is Schema.InferOutput<T> {
  const { issues } = validate(schema, input);
  if (issues) throw new SchemaError(issues);
}

export class WrappedSyncSchema<T extends Schema> {
  constructor(public readonly schema: T) {}

  validate = (input: unknown): Schema.Result<Schema.InferOutput<T>> =>
    validate(this.schema, input);
  safeParse = this.validate;

  parse = (input: unknown): Schema.InferOutput<T> => parse(this.schema, input);
  decode = (input: Schema.InferInput<T>): Schema.InferOutput<T> =>
    decode(this.schema, input);

  is = (input: unknown): input is Schema.InferOutput<T> =>
    is(this.schema, input);
  assert = (input: unknown): asserts input is Schema.InferOutput<T> =>
    assert(this.schema, input);
}

export const wrap = <T extends Schema>(schema: T): WrappedSyncSchema<T> =>
  new WrappedSyncSchema(schema);
