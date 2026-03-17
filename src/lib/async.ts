import {
  type StandardSchemaV1,
  SchemaError,
  type Result,
  convertResult,
} from "./common.ts";

/** Asynchronously validates the input against the schema.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 */
export async function parse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): Promise<StandardSchemaV1.InferOutput<T>> {
  const result = await safeParse(schema, input, options);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}
/** Asynchronously validates the input against the schema.
 * @returns The result of the validation.
 */
export async function safeParse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): Promise<Result<StandardSchemaV1.InferOutput<T>>> {
  let result = schema["~standard"].validate(input, options);
  if (result instanceof Promise) result = await result;
  return convertResult(result);
}
export { safeParse as validate };

/** Asynchronously validates the input against the schema.
 * @param input Unlike {@link parse}, this is strongly-typed to match the schema's input type.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 */
export async function decode<T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
): Promise<StandardSchemaV1.InferOutput<T>> {
  return await parse(schema, input, options);
}
/** Asynchronously validates the input against the schema.
 * @param input Unlike {@link validate}, this is strongly-typed to match the schema's input type.
 * @returns The result of the validation.
 */
export async function safeDecode<T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
): Promise<Result<StandardSchemaV1.InferOutput<T>>> {
  return await safeParse(schema, input, options);
}

/** A class that wraps a Standard Schema and provides asynchronous utility methods. */
export class WrappedAsyncSchema<T extends StandardSchemaV1> {
  constructor(public readonly schema: T) {}

  /** @see {@link parse} */
  async parse(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): Promise<StandardSchemaV1.InferOutput<T>> {
    return await parse(this.schema, input, options);
  }
  /** @see {@link safeParse} */
  async safeParse(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): Promise<Result<StandardSchemaV1.InferOutput<T>>> {
    return await safeParse(this.schema, input, options);
  }
  /** @see {@link safeParse} */
  validate = this.safeParse;

  /** @see {@link decode} */
  async decode(
    input: StandardSchemaV1.InferInput<T>,
    options?: StandardSchemaV1.Options | undefined,
  ): Promise<StandardSchemaV1.InferOutput<T>> {
    return await decode(this.schema, input, options);
  }
  /** @see {@link safeDecode} */
  async safeDecode(
    input: StandardSchemaV1.InferInput<T>,
    options?: StandardSchemaV1.Options | undefined,
  ): Promise<Result<StandardSchemaV1.InferOutput<T>>> {
    return await safeDecode(this.schema, input, options);
  }
}

/** Wraps a Standard Schema in a class that provides asynchronous utility methods. */
export function wrap<T extends StandardSchemaV1>(
  schema: T,
): WrappedAsyncSchema<T> {
  return new WrappedAsyncSchema(schema);
}
