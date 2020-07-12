import { NowRequestHandler } from 'fastify-now';
import S from 'fluent-schema';
import { getGlamItemsById } from '@lib/queries/glamsItems';

export const GET: NowRequestHandler<{ Params: { glamId: string } }> = async function (req) {
  const { glamId } = req.params;
  const result = await this.pg.pool.query(getGlamItemsById(glamId));
  return result.rows;
};

GET.opts = {
  schema: {
    response: {
      200: S.array().items(
        S.object()
          .prop('file_path', S.string().required())
          .prop('glam_id', S.string().required())
          .prop('thumbnail_url', S.string())
          .prop('upload_date', S.string())
          .prop('name', S.string().required())
          .prop('created_at', S.string().required())
          .prop('updated_at', S.string().required()),
      ),
    },
  },
};
