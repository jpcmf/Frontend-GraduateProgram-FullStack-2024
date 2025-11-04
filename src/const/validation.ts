export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/
  },
  NAME: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100
  },
  UF: {
    MAX_LENGTH: 2
  }
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: "Campo obrigatório",
  INVALID_EMAIL: "E-mail deve ser um e-mail válido.",
  USERNAME_IS_EMAIL: "Usuário não pode ser um e-mail.",
  PASSWORDS_DONT_MATCH: "Senhas não conferem.",
  PASSWORD_TOO_SHORT: `Senha deve ter no mínimo ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres.`,
  PASSWORD_NEEDS_UPPERCASE: "Senha deve conter pelo menos uma letra maiúscula.",
  PASSWORD_NEEDS_NUMBER: "Senha deve conter pelo menos um número.",
  USERNAME_TOO_SHORT: `Usuário deve ter no mínimo ${VALIDATION_RULES.USERNAME.MIN_LENGTH} caracteres.`,
  NAME_TOO_SHORT: `Nome deve ter no mínimo ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres.`
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UPPERCASE: /[A-Z]/,
  NUMBER: /[0-9]/,
  SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/
} as const;
