import SQL from '@nearform/sql';

export const getGlamItemsById = (glamId: string) =>
  SQL`SELECT * FROM glams_items WHERE glam_id = ${glamId}`;
