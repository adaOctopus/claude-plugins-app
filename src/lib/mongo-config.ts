/**
 * Mongo connection config — URI stays at cluster root (no /dbname in path).
 * Database is selected via dbName so Vercel/Atlas connect strings work unchanged.
 *
 * Priority for database name:
 * 1. MONGODB_DB_NAME env var
 * 2. Name embedded in MONGODB_URI path (legacy / local .env.local)
 * 3. "test" (Mongo default — production data lives here when URI omits a db name)
 */
export function getMongoConfig(): { uri: string; dbName: string } {
  const rawUri = process.env.MONGODB_URI?.trim();
  if (!rawUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  const explicitDb = process.env.MONGODB_DB_NAME?.trim();
  const [base, query = ""] = rawUri.split("?");

  const match = base.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)(?:\/(.*))?$/);
  if (!match) {
    throw new Error("Invalid MONGODB_URI format");
  }

  const clusterRoot = match[1];
  const uriDbName = match[2]?.trim();
  const dbName = explicitDb || uriDbName || "test";

  const uri = query ? `${clusterRoot}/?${query}` : `${clusterRoot}/`;

  return { uri, dbName };
}
