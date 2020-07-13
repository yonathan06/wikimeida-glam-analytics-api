import { NowRequestHandler } from 'fastify-now';
import S from 'fluent-schema';
import { fetchFilesData } from '@lib/wikipediaAPI';

export const GET: NowRequestHandler<{ Querystring: { fileName: string } }> = async (req) => {
  const { fileName } = req.query;
  const fileData = await fetchFilesData([fileName]);
  return fileData[0];
};

export const FileDataResponseSchema = S.object()
  .prop('title', S.string().required())
  .prop('file_path', S.string().required())
  .prop('upload_date', S.string().format('date-time').required())
  .prop('page_url', S.string().format('url').required())
  .prop('thumbnail_url', S.string().format('url').required());

GET.opts = {
  schema: {
    querystring: S.object().prop('fileName', S.string().required()),
    response: {
      200: FileDataResponseSchema,
    },
  },
};
