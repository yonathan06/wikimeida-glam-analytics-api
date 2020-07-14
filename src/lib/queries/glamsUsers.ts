import SQL from '@nearform/sql';

export const authenticateAndGetUser = (glamId: string, username: string, password: string) =>
  SQL`SELECT * FROM glams_users 
      WHERE glam_id = ${glamId} AND 
            username = ${username} AND 
            password = crypt(${password}, password)
    `;
