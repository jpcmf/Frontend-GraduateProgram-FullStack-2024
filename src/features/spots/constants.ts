export const SPOT_VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MAX_LENGTH: 500
  },
  ADDRESS: {
    MAX_LENGTH: 200
  }
} as const;

export const SPOT_VALIDATION_MESSAGES = {
  REQUIRED: "Campo obrigatório",
  NAME_TOO_SHORT: `Nome deve ter no mínimo ${SPOT_VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`,
  NAME_TOO_LONG: `Nome deve ter no máximo ${SPOT_VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`,
  DESCRIPTION_TOO_LONG: `Descrição deve ter no máximo ${SPOT_VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} caracteres`,
  ADDRESS_TOO_LONG: `Endereço deve ter no máximo ${SPOT_VALIDATION_RULES.ADDRESS.MAX_LENGTH} caracteres`,
  INVALID_TYPE: "Tipo de spot inválido"
} as const;
