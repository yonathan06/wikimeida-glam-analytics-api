import { NowRequestHandler } from 'fastify-now';
import S from 'fluent-schema';
import fetch from 'node-fetch';

export const GET: NowRequestHandler = async function (req, res) {
  const { fileName } = req.query as { fileName: string };
  const response = await fetch(`https://magnus-toolserver.toolforge.org/commonsapi.php?image=${fileName}&thumbwidth=150&thumbheight=150`);
  const xmlString = await response.text();
  res.header('content-type', 'text/xml');
  res.status(response.status);
  return xmlString;
};

GET.opts = {
  schema: {
    querystring: S.object()
      .prop('fileName', S.string().required()),
    response: {
      200: S.string()
    },
  }
};