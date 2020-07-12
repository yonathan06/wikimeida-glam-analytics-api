import SQL from '@nearform/sql';
import GlamMediaItem from '@lib/models/GlamMediaItem';

export const getGlamItemsById = (glamId: string) =>
  SQL`SELECT * FROM glams_items WHERE glam_id = ${glamId}`;

export const insertGlamItem = (glamId: string, item: Partial<GlamMediaItem>) =>
  SQL`INSERT INTO glams_items (file_path, glam_id, name, thumbnail_url, file_url, upload_date) 
      VALUES (${item.file_path}, ${glamId}, ${item.name}, ${item.thumbnail_url}, ${item.file_url}, ${item.upload_date})
      RETURNING *`;
