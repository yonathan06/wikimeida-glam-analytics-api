import { NowRequestHandler } from 'fastify-now';
import { NotFound } from 'http-errors';
import S from 'fluent-schema';
import { getGlamById } from '@lib/queries/glams';

export const GET: NowRequestHandler<{ Params: { glamId: string } }> = async function (req) {
  const { glamId } = req.params;
  const results = await this.pg.pool.query(getGlamById(glamId));
  const glam = results.rows[0];
  if (!glam) {
    throw new NotFound();
  }
  return glam;
};

GET.opts = {
  schema: {
    response: {
      200: S.object()
        .prop('id', S.string().required())
        .prop('name', S.string().required())
        .prop('created_at', S.string().required())
        .prop('updated_at', S.string().required()),
    },
  },
};
