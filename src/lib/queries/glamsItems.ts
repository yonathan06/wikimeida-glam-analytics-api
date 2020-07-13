import SQL from '@nearform/sql';
import GlamMediaItem from '@lib/models/GlamMediaItem';

export const getGlamItemsById = (glamId: string) =>
  SQL`SELECT * FROM glams_items WHERE glam_id = ${glamId}`;

export const insertGlamItem = (glamId: string, item: Partial<GlamMediaItem>) =>
  SQL`INSERT INTO glams_items (file_path, glam_id, title, thumbnail_url, page_url, upload_date) 
      VALUES (${item.file_path}, ${glamId}, ${item.title}, ${item.thumbnail_url}, ${item.page_url}, ${item.upload_date})
      RETURNING *`;
