import { NowRequestHandler } from 'fastify-now';
import S from 'fluent-schema';

export const GET: NowRequestHandler<{ Params: { glamId: string } }> = async function (req) {
  const { glamId } = req.params;
  const result = await this.pg.pool.query(`SELECT * FROM glams_items WHERE glam_id = $1`, [glamId]);
  return result.rows;
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
