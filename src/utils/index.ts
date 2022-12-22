export const validateEnv = () => {
  const requiredEnvVars = ['DB_URI', 'TWITTER_API_KEY', 'TWITTER_API_SECRET'];
  const nonExistantVars = requiredEnvVars.filter(v => !process.env[v]);
  if (!nonExistantVars.length) return;
  throw new Error(`Env vars ${nonExistantVars.join(',')} are required`);
};


export const wait = async (ms: number) => new Promise(res => setTimeout(res, ms));
