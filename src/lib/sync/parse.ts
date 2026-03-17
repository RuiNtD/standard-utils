import type { StandardSchemaV1, InferOutput } from "../types.ts";
import { SchemaError, type Result, convertResult } from "../common.ts";

/** Synchronously validates the input against the schema.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export function parse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): InferOutput<T> {
  const result = safeParse(schema, input, options);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

/** Synchronously validates the input against the schema.
 * @returns The result of the validation.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export function safeParse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): Result<InferOutput<T>> {
  const result = schema["~standard"].validate(input, options);
  if (result instanceof Promise)
    throw new TypeError("Schema validation must be synchronous");
  return convertResult(result);
}

export { safeParse as validate };
