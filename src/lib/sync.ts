import {
  type StandardSchemaV1 as S,
  SchemaError,
  type Result,
  convertResult,
} from "./common.ts";

export function validate<T extends S>(
  schema: T,
  input: unknown,
): Result<S.InferOutput<T>> {
  const result = schema["~standard"].validate(input);
  if (result instanceof Promise)
    throw new TypeError("Schema validation must be synchronous");
  return convertResult(result);
}

export function parse<T extends S>(
  schema: T,
  input: unknown,
): S.InferOutput<T> {
  const result = validate(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}
export const safeParse = validate;

export const decode = <T extends S>(
  schema: T,
  input: S.InferInput<T>,
): S.InferOutput<T> => parse(schema, input);
export const safeDecode = <T extends S>(
  schema: T,
  input: S.InferInput<T>,
): Result<S.InferOutput<T>> => safeParse(schema, input);

export function is<T extends S>(
  schema: T,
  input: unknown,
): input is S.InferOutput<T> {
  return validate(schema, input).success;
}
export function assert<T extends S>(
  schema: T,
  input: unknown,
): asserts input is S.InferOutput<T> {
  parse(schema, input);
}

export class WrappedSyncSchema<T extends S> {
  constructor(public readonly schema: T) {}

  validate = (input: unknown): Result<S.InferOutput<T>> =>
    validate(this.schema, input);

  parse = (input: unknown): S.InferOutput<T> => parse(this.schema, input);
  safeParse = this.validate;

  decode = (input: S.InferInput<T>): S.InferOutput<T> =>
    decode(this.schema, input);
  safeDecode = (input: S.InferInput<T>): Result<S.InferOutput<T>> =>
    safeDecode(this.schema, input);

  is = (input: unknown): input is S.InferOutput<T> => is(this.schema, input);
  assert = (input: unknown): asserts input is S.InferOutput<T> =>
    assert(this.schema, input);
}

export const wrap = <T extends S>(schema: T): WrappedSyncSchema<T> =>
  new WrappedSyncSchema(schema);
