import {
  type StandardSchemaV1 as S,
  SchemaError,
  type Result,
  convertResult,
} from "./common.ts";

export function validate<T extends S>(
  schema: T,
  input: unknown,
  options?: S.Options | undefined,
): Result<S.InferOutput<T>> {
  const result = schema["~standard"].validate(input, options);
  if (result instanceof Promise)
    throw new TypeError("Schema validation must be synchronous");
  return convertResult(result);
}

export function parse<T extends S>(
  schema: T,
  input: unknown,
  options?: S.Options | undefined,
): S.InferOutput<T> {
  const result = validate(schema, input, options);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}
export const safeParse = validate;

export const decode = <T extends S>(
  schema: T,
  input: S.InferInput<T>,
  options?: S.Options | undefined,
): S.InferOutput<T> => parse(schema, input, options);
export const safeDecode = <T extends S>(
  schema: T,
  input: S.InferInput<T>,
  options?: S.Options | undefined,
): Result<S.InferOutput<T>> => safeParse(schema, input, options);

export function is<T extends S>(
  schema: T,
  input: unknown,
  options?: S.Options | undefined,
): input is S.InferOutput<T> {
  return validate(schema, input, options).success;
}
export function assert<T extends S>(
  schema: T,
  input: unknown,
  options?: S.Options | undefined,
): asserts input is S.InferOutput<T> {
  parse(schema, input, options);
}

export class WrappedSyncSchema<T extends S> {
  constructor(public readonly schema: T) {}

  validate = (
    input: unknown,
    options?: S.Options | undefined,
  ): Result<S.InferOutput<T>> => validate(this.schema, input, options);

  parse = (input: unknown, options?: S.Options | undefined): S.InferOutput<T> =>
    parse(this.schema, input, options);
  safeParse = this.validate;

  decode = (
    input: S.InferInput<T>,
    options?: S.Options | undefined,
  ): S.InferOutput<T> => decode(this.schema, input, options);
  safeDecode = (
    input: S.InferInput<T>,
    options?: S.Options | undefined,
  ): Result<S.InferOutput<T>> => safeDecode(this.schema, input, options);

  is = (
    input: unknown,
    options?: S.Options | undefined,
  ): input is S.InferOutput<T> => is(this.schema, input, options);
  assert = (
    input: unknown,
    options?: S.Options | undefined,
  ): asserts input is S.InferOutput<T> => assert(this.schema, input, options);
}

export const wrap = <T extends S>(schema: T): WrappedSyncSchema<T> =>
  new WrappedSyncSchema(schema);
