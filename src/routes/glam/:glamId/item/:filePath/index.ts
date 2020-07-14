import { NowRequestHandler } from 'fastify-now';
import { Forbidden } from 'http-errors';
import { deleteGlamItem } from '@lib/queries/glamsItems';

export const DELETE: NowRequestHandler<{
  Params: { glamId: string; filePath: string };
}> = async function (req) {
  const { glamId, filePath } = req.params;
  const decodedToken = await req.authenticate();
  if (glamId !== decodedToken.glam_id) {
    throw new Forbidden();
  }
  await this.pg.pool.query(deleteGlamItem(glamId, filePath));
  return { message: 'deleted' };
};
