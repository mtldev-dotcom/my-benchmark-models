import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

export function getDb(): ReturnType<typeof postgres> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");

    const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
    _sql = postgres(url, { ssl: isLocal ? false : "require" });
  }
  return _sql;
}
