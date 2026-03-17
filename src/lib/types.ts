import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { WrappedAsyncSchema } from "./async.ts";
import type { WrappedSyncSchema } from "./sync.ts";

export type { StandardSchemaV1, WrappedAsyncSchema, WrappedSyncSchema };

/** A class that wraps a Standard Schema and provides utility methods. */
export type WrappedSchema<Input, Output = Input> =
  | WrappedAsyncSchema<Input, Output>
  | WrappedSyncSchema<Input, Output>;

/** Infers the input type of a Standard Schema. */
export type InferInput<T extends StandardSchemaV1> =
  StandardSchemaV1.InferInput<T>;

/** Infers the output type of a Standard Schema. */
export type InferOutput<T extends StandardSchemaV1> =
  StandardSchemaV1.InferOutput<T>;

/** Infers the output type of a Standard Schema. */
export type Infer<T extends StandardSchemaV1> = InferOutput<T>;
