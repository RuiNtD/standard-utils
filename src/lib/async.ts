import {
  type StandardSchemaV1 as S,
  SchemaError,
  type Result,
  convertResult,
} from "./common.ts";

export async function validate<T extends S>(
  schema: T,
  input: unknown,
): Promise<Result<S.InferOutput<T>>> {
  let result = schema["~standard"].validate(input);
  if (result instanceof Promise) result = await result;
  return convertResult(result);
}

export async function parse<T extends S>(
  schema: T,
  input: unknown,
): Promise<S.InferOutput<T>> {
  const result = await validate(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}
export const safeParse = validate;

export const decode = async <T extends S>(
  schema: T,
  input: S.InferInput<T>,
): Promise<S.InferOutput<T>> => await parse(schema, input);
export const safeDecode = async <T extends S>(
  schema: T,
  input: S.InferInput<T>,
): Promise<Result<S.InferOutput<T>>> => await safeParse(schema, input);

export class WrappedAsyncSchema<T extends S> {
  constructor(public readonly schema: T) {}

  validate = (input: unknown): Promise<Result<S.InferOutput<T>>> =>
    validate(this.schema, input);

  parse = (input: unknown): Promise<S.InferOutput<T>> =>
    parse(this.schema, input);
  safeParse = this.validate;

  decode = (input: S.InferInput<T>): Promise<S.InferOutput<T>> =>
    decode(this.schema, input);
  safeDecode = (input: S.InferInput<T>): Promise<Result<S.InferOutput<T>>> =>
    safeDecode(this.schema, input);
}

export const wrap = <T extends S>(schema: T): WrappedAsyncSchema<T> =>
  new WrappedAsyncSchema(schema);
