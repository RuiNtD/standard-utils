import {
  type StandardSchemaV1 as S,
  SchemaError,
  type Result,
  convertResult,
} from "./common.ts";

export async function validate<T extends S>(
  schema: T,
  input: unknown,
  options?: S.Options | undefined,
): Promise<Result<S.InferOutput<T>>> {
  let result = schema["~standard"].validate(input, options);
  if (result instanceof Promise) result = await result;
  return convertResult(result);
}

export async function parse<T extends S>(
  schema: T,
  input: unknown,
  options?: S.Options | undefined,
): Promise<S.InferOutput<T>> {
  const result = await validate(schema, input, options);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}
export const safeParse = validate;

export const decode = async <T extends S>(
  schema: T,
  input: S.InferInput<T>,
  options?: S.Options | undefined,
): Promise<S.InferOutput<T>> => await parse(schema, input, options);
export const safeDecode = async <T extends S>(
  schema: T,
  input: S.InferInput<T>,
  options?: S.Options | undefined,
): Promise<Result<S.InferOutput<T>>> => await safeParse(schema, input, options);

export class WrappedAsyncSchema<T extends S> {
  constructor(public readonly schema: T) {}

  validate = (
    input: unknown,
    options?: S.Options | undefined,
  ): Promise<Result<S.InferOutput<T>>> => validate(this.schema, input, options);

  parse = (
    input: unknown,
    options?: S.Options | undefined,
  ): Promise<S.InferOutput<T>> => parse(this.schema, input, options);
  safeParse = this.validate;

  decode = (
    input: S.InferInput<T>,
    options?: S.Options | undefined,
  ): Promise<S.InferOutput<T>> => decode(this.schema, input, options);
  safeDecode = (
    input: S.InferInput<T>,
    options?: S.Options | undefined,
  ): Promise<Result<S.InferOutput<T>>> =>
    safeDecode(this.schema, input, options);
}

export const wrap = <T extends S>(schema: T): WrappedAsyncSchema<T> =>
  new WrappedAsyncSchema(schema);
