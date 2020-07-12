import { NowRequestHandler } from 'fastify-now';
import { URLSearchParams } from 'url';
import S from 'fluent-schema';
import fetch from 'node-fetch';

interface CategoryFileMembersResponse {
  batchcomplete: string;
  continue: {
    cmcontinue: string;
    continue: string;
  };
  query: {
    categorymembers: {
      pageid: number;
      ns: number;
      title: string;
    }[];
  };
}

async function fetchFileListByCategory(category: string, next?: string) {
  const queryParams = new URLSearchParams();
  queryParams.append('action', 'query');
  queryParams.append('list', 'categorymembers');
  queryParams.append('cmtype', 'file');
  queryParams.append('format', 'json');
  if (!/^Category:/.test(category)) {
    category = `Category:${category}`;
  }
  queryParams.append('cmtitle', category);
  if (next) {
    queryParams.append('cmcontinue', next);
  }
  return await fetch(`https://commons.wikimedia.org/w/api.php?${queryParams}`);
}

export const GET: NowRequestHandler<{ Querystring: { category: string; next?: string } }> = async (
  req,
  res,
) => {
  const { category, next } = req.query;
  const response = await fetchFileListByCategory(category, next);
  res.status(response.status);
  return await response.json();
};

GET.opts = {
  schema: {
    querystring: S.object().prop('category', S.string().required()).prop('next', S.string()),
    response: {
      200: S.object()
        .prop('batchcomplete', S.string())
        .prop('continue', S.object().prop('cmcontinue', S.string()).prop('continue', S.string()))
        .prop(
          'query',
          S.object().prop(
            'categorymembers',
            S.array().items(
              S.object()
                .prop('pageid', S.number())
                .prop('ns', S.number())
                .prop('title', S.string()),
            ),
          ),
        ),
    },
  },
};
