export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      has_DATABASE_URL: Boolean(process.env.DATABASE_URL),
      has_DATABASE__URL: Boolean(process.env.DATABASE__URL),
      node: process.version,
    }),
  };
};
