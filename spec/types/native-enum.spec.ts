import { z } from 'zod';
import { createSchemas, expectSchema, registerSchema } from '../lib/helpers';

describe('native enum', () => {
  it('supports native enums', () => {
    enum NativeEnum {
      OPTION = 'Option',
      ANOTHER = 'Another',
      DEFAULT = 'Default',
    }

    const nativeEnumSchema = registerSchema(
      'NativeEnum',
      z.nativeEnum(NativeEnum).openapi({
        description: 'A native enum in zod',
      })
    );

    expectSchema([nativeEnumSchema], {
      NativeEnum: {
        type: 'string',
        description: 'A native enum in zod',
        enum: ['Option', 'Another', 'Default'],
      },
    });
  });

  it('supports native numeric enums', () => {
    enum NativeEnum {
      OPTION = 1,
      ANOTHER = 42,
      DEFAULT = 3,
    }

    const nativeEnumSchema = registerSchema(
      'NativeEnum',
      z.nativeEnum(NativeEnum).openapi({
        description: 'A native numbers enum in zod',
      })
    );

    expectSchema([nativeEnumSchema], {
      NativeEnum: {
        type: 'integer',
        description: 'A native numbers enum in zod',
        enum: [1, 42, 3],
      },
    });
  });

  it('does not support mixed native enums', () => {
    enum NativeEnum {
      OPTION = 1,
      ANOTHER = '42',
    }

    const nativeEnumSchema = registerSchema(
      'NativeEnum',
      z.nativeEnum(NativeEnum).openapi({
        description: 'A native mixed enum in zod',
      })
    );

    expect(() => {
      createSchemas([nativeEnumSchema]);
    }).toThrowError(/Enum has mixed string and number values/);
  });

  it('can manually set type of mixed native enums', () => {
    enum NativeEnum {
      OPTION = 1,
      ANOTHER = '42',
    }

    const nativeEnumSchema = registerSchema(
      'NativeEnum',
      z.nativeEnum(NativeEnum).openapi({
        description: 'A native mixed enum in zod',
        type: 'string',
      })
    );

    expectSchema([nativeEnumSchema], {
      NativeEnum: {
        type: 'string',
        description: 'A native mixed enum in zod',
      },
    });
  });
});
