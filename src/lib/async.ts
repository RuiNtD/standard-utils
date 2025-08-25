import { type Schema, SchemaError } from "./helpers.ts";

export async function validate<T extends Schema>(
  schema: T,
  input: unknown
): Promise<Schema.Result<Schema.InferOutput<T>>> {
  let result = schema["~standard"].validate(input);
  if (result instanceof Promise) result = await result;
  return result;
}
export const safeParse = validate;

export async function parse<T extends Schema>(schema: T, input: unknown) {
  const result = await validate(schema, input);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

export const decode = async <T extends Schema>(
  schema: T,
  input: Schema.InferInput<T>
) => await parse(schema, input);

export async function is<T extends Schema>(schema: T, input: unknown) {
  const success = !(await validate(schema, input)).issues;
  return (_: unknown): _ is Schema.InferOutput<T> => success;
}

export async function assert<T extends Schema>(schema: T, input: unknown) {
  const { issues } = await validate(schema, input);
  return (_: unknown): asserts _ is Schema.InferOutput<T> => {
    if (issues) throw new SchemaError(issues);
  };
}

export class WrappedAsyncSchema<T extends Schema> {
  constructor(public readonly schema: T) {}

  validate = (input: unknown) => validate(this.schema, input);
  safeParse = this.validate;

  parse = (input: unknown) => parse(this.schema, input);
  decode = (input: Schema.InferInput<T>) => decode(this.schema, input);

  is = (input: unknown) => is(this.schema, input);
  assert = (input: unknown) => assert(this.schema, input);
}

export const wrap = <T extends Schema>(schema: T) =>
  new WrappedAsyncSchema(schema);
