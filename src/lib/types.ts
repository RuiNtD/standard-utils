import type { StandardSchemaV1 } from "./common.ts";
import type { WrappedAsyncSchema } from "./async.ts";
import type { WrappedSyncSchema } from "./sync.ts";

export type { WrappedAsyncSchema, WrappedSyncSchema };
/** A class that wraps a Standard Schema and provides utility methods. */
export type WrappedSchema<Schema extends StandardSchemaV1 = StandardSchemaV1> =
  | WrappedAsyncSchema<Schema>
  | WrappedSyncSchema<Schema>;

/** Infers the input type of a Standard Schema or a wrapped Standard Schema. */
export type InferInput<
  Schema extends StandardSchemaV1 | { schema: StandardSchemaV1 },
> = Schema extends StandardSchemaV1
  ? StandardSchemaV1.InferInput<Schema>
  : Schema extends { schema: StandardSchemaV1 }
    ? StandardSchemaV1.InferInput<Schema["schema"]>
    : never;

/** Infers the output type of a Standard Schema or a wrapped Standard Schema. */
export type InferOutput<
  Schema extends StandardSchemaV1 | { schema: StandardSchemaV1 },
> = Schema extends StandardSchemaV1
  ? StandardSchemaV1.InferOutput<Schema>
  : Schema extends { schema: StandardSchemaV1 }
    ? StandardSchemaV1.InferOutput<Schema["schema"]>
    : never;
