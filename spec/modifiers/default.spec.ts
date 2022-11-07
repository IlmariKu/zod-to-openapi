import { z } from 'zod';
import { expectSchema, registerSchema } from '../lib/helpers';

describe('default', () => {
  it('supports defaults', () => {
    expectSchema(
      [registerSchema('StringWithDefault', z.string().default('test'))],
      {
        StringWithDefault: {
          type: 'string',
          default: 'test',
        },
      }
    );
  });

  it('supports defaults override', () => {
    expectSchema(
      [
        registerSchema(
          'StringWithDefault',
          z.string().default('test').default('override')
        ),
      ],
      {
        StringWithDefault: {
          type: 'string',
          default: 'override',
        },
      }
    );
  });

  it('supports falsy defaults', () => {
    expectSchema(
      [registerSchema('BooleanWithDefault', z.boolean().default(false))],
      {
        BooleanWithDefault: {
          type: 'boolean',
          default: false,
        },
      }
    );
  });

  it('supports optional defaults', () => {
    expectSchema(
      [
        registerSchema(
          'ObjectWithDefault',
          z.object({
            test: z.ostring().default('test'),
          })
        ),
      ],
      {
        ObjectWithDefault: {
          type: 'object',
          properties: {
            test: {
              type: 'string',
              default: 'test',
            },
          },
        },
      }
    );
  });

  it('supports required defaults', () => {
    expectSchema(
      [
        registerSchema(
          'ObjectWithDefault',
          z.object({
            test: z.string().default('test'),
          })
        ),
      ],
      {
        ObjectWithDefault: {
          type: 'object',
          properties: {
            test: {
              type: 'string',
              default: 'test',
            },
          },
          required: ['test'],
        },
      }
    );
  });

  it('supports optional default schemas with refine', () => {
    expectSchema(
      [
        registerSchema(
          'Object',
          z.object({
            test: z
              .onumber()
              .default(42)
              .refine(num => num && num % 2 === 0),
          })
        ),
      ],
      {
        Object: {
          type: 'object',
          properties: {
            test: {
              type: 'number',
              default: 42,
            },
          },
        },
      }
    );
  });

  it('supports required default schemas with refine', () => {
    expectSchema(
      [
        registerSchema(
          'Object',
          z.object({
            test: z
              .number()
              .default(42)
              .refine(num => num && num % 2 === 0),
          })
        ),
      ],
      {
        Object: {
          type: 'object',
          properties: {
            test: {
              type: 'number',
              default: 42,
            },
          },
          required: ['test'],
        },
      }
    );
  });

  it('supports overriding default with .openapi', () => {
    expectSchema(
      [
        registerSchema(
          'EnumWithDefault',
          z.enum(['a', 'b']).default('a')
        ).openapi({ default: 'b', examples: ['b'] }),
      ],
      {
        EnumWithDefault: {
          default: 'b',
          enum: ['a', 'b'],
          type: 'string',
          examples: ['b'],
        },
      }
    );
  });
});
