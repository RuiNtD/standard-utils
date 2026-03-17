import type { StandardSchemaV1, InferOutput } from "../types.ts";
import { SchemaError, type Result, convertResult } from "../common.ts";

/** Asynchronously validates the input against the schema.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 */
export async function parse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): Promise<InferOutput<T>> {
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
): Promise<Result<InferOutput<T>>> {
  let result = schema["~standard"].validate(input, options);
  if (result instanceof Promise) result = await result;
  return convertResult(result);
}

export { safeParse as validate };
