import SQL from '@nearform/sql';

export const getGlamById = (glamId: string) => SQL`SELECT * FROM glams WHERE id = ${glamId}`;
