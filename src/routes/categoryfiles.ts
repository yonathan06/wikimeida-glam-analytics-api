import { NowRequestHandler } from 'fastify-now';
import S from 'fluent-schema';
import { fetchFileListByCategory, fetchFilesData } from '@lib/wikipediaAPI';
import { FileDataResponseSchema } from './filedata';

export const GET: NowRequestHandler<{ Querystring: { category: string; next?: string } }> = async (
  req,
) => {
  const { category, next } = req.query;
  const data = await fetchFileListByCategory(category, next);
  const fileNames = data.query.categorymembers.map((item) => item.title);
  const filesData = await fetchFilesData(fileNames);
  return {
    items: filesData,
    next: data.continue?.cmcontinue,
  };
};

GET.opts = {
  schema: {
    querystring: S.object().prop('category', S.string().required()).prop('next', S.string()),
    response: {
      200: S.object()
        .prop('items', S.array().items(FileDataResponseSchema).required())
        .prop('next', S.string()),
    },
  },
};
