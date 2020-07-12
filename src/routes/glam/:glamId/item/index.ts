import { NowRequestHandler } from 'fastify-now';
import S from 'fluent-schema';
import { getGlamItemsById, insertGlamItem } from '@lib/queries/glamsItems';
import GlamMediaItem from '@lib/models/GlamMediaItem';

export const GET: NowRequestHandler<{ Params: { glamId: string } }> = async function (req) {
  const { glamId } = req.params;
  const result = await this.pg.pool.query(getGlamItemsById(glamId));
  return { items: result.rows };
};

const getBaseItemSchema = () =>
  S.object()
    .prop('file_path', S.string().required())
    .prop('file_url', S.string().required())
    .prop('thumbnail_url', S.string().required())
    .prop('upload_date', S.string().required())
    .prop('name', S.string().required());

const ItemsResponsePayload = S.object().prop(
  'items',
  S.array()
    .items(
      getBaseItemSchema()
        .prop('glam_id', S.string().required())
        .prop('created_at', S.string())
        .prop('updated_at', S.string())
        .additionalProperties(false),
    )
    .required(),
);

GET.opts = {
  schema: {
    response: {
      200: ItemsResponsePayload,
    },
  },
};

export const POST: NowRequestHandler<{
  Params: { glamId: string };
  Body: { items: Partial<GlamMediaItem>[] };
}> = async function (req, res) {
  const { glamId } = req.params;
  const { items } = req.body;
  const insertItems = items.map((item) => this.pg.pool.query(insertGlamItem(glamId, item)));
  const results = await Promise.all(insertItems);
  res.status(201);
  return { items: results.map((result) => result.rows[0]) };
};

POST.opts = {
  schema: {
    body: S.object().prop(
      'items',
      S.array().items(getBaseItemSchema().additionalProperties(false)).required(),
    ),
    response: {
      201: ItemsResponsePayload,
    },
  },
};
