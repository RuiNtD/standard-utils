import type { StandardSchemaV1, InferInput, InferOutput } from "../types.ts";
import type { Result } from "../common.ts";
import { decode, safeDecode } from "./decode.ts";

export function decoder<T extends StandardSchemaV1>(
  schema: T,
): (
  input: InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
) => InferOutput<T> {
  return (input, options) => decode(schema, input, options);
}

export function safeDecoder<T extends StandardSchemaV1>(
  schema: T,
): (
  input: InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
) => Result<InferOutput<T>> {
  return (input, options) => safeDecode(schema, input, options);
}
