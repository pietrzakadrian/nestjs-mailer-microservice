export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_VERIFICATION_TOKEN_SECRET':
        return '7000';
      case 'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME':
        return '7000';
      case 'EMAIL_HOST':
        return '7000';
      case 'EMAIL_PORT':
        return '7000';
      case 'EMAIL_PORT':
        return '7000';
      case 'EMAIL_ADDRESS':
        return '7000';
      case 'EMAIL_PASSWORD':
        return '7000';
      case 'EMAIL_CONFIRMATION_URL':
        return '7000';
      case 'REDIS_HOST':
        return '7000';
      case 'REDIS_PORT':
        return '7000';
    }
  },
};
