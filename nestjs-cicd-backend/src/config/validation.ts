export const validateEnv = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL missing');
  }
};
