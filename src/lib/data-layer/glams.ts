import { Pool } from 'pg';

export interface Glam {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export async function getGlamById(pg: Pool, glamId: string): Promise<Glam | undefined> {
  const result = await pg.query<Glam>(`SELECT * FROM glams WHERE id = $1`, [glamId]);
  return result.rows[0];
}
