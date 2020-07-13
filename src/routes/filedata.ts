import { NowRequestHandler } from 'fastify-now';
import S from 'fluent-schema';
import fetch from 'node-fetch';
import parseISO from 'date-fns/parseISO';

export const GET: NowRequestHandler<{ Querystring: { fileName: string } }> = async (req) => {
  let { fileName } = req.query;
  fileName = fileName.replace(/^File:/, '');
  const response = await fetch(
    `https://commons.wikimedia.org/w/api.php?format=json&action=query&prop=imageinfo&iilimit=500&iiprop=timestamp|user|url|metadata&iiurlwidth=250&titles=File:${encodeURIComponent(
      fileName,
    )}`,
  );
  const { query } = await response.json();
  const fileData = Object.values(query.pages)[0];
  const { title, imageinfo } = fileData as any;
  const latestInfo = imageinfo[0];
  const { timestamp, url, thumburl } = latestInfo;
  const page_url = `https://commons.wikimedia.org/wiki/File:${fileName}`;
  return {
    title,
    file_path: url.replace('https://upload.wikimedia.org', ''),
    thumbnail_url: thumburl,
    upload_date: parseISO(timestamp),
    page_url,
  };
};

GET.opts = {
  schema: {
    querystring: S.object().prop('fileName', S.string().required()),
    response: {
      200: S.object()
        .prop('title', S.string().required())
        .prop('file_path', S.string().required())
        .prop('upload_date', S.string().format('date-time').required())
        .prop('page_url', S.string().format('url').required())
        .prop('thumbnail_url', S.string().format('url').required()),
    },
  },
};
