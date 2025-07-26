
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = 'postgresql://postgres.mcbuxkyofjngibhxvxvk:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
