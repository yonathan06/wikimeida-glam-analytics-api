import { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import parseISO from 'date-fns/parseISO';
import createHttpError from 'http-errors';

async function callCommonsApi(queryParams: URLSearchParams) {
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${queryParams}`);
  if (!response.ok) {
    throw createHttpError({ text: await response.text(), status: response.status });
  }
  return await response.json();
}

export async function fetchFilesData(filesNames: string[]) {
  const encodedNormalizedFileNames = filesNames.map((name) => {
    if (!/^File:/.test(name)) {
      name = `File:${name}`;
    }
    return encodeURIComponent(name);
  });
  const queryParams = new URLSearchParams();
  queryParams.append('action', 'query');
  queryParams.append('prop', 'imageinfo');
  queryParams.append('iilimit', '500');
  queryParams.append('iiprop', 'timestamp|user|url|metadata');
  queryParams.append('iiurlwidth', '250');
  queryParams.append('titles', encodedNormalizedFileNames.join('|'));
  queryParams.append('format', 'json');
  const { query } = await callCommonsApi(queryParams);
  return Object.values(query.pages).map((page) => {
    const { title, imageinfo } = page as any;
    const latestInfo = imageinfo[0];
    const { timestamp, url, thumburl } = latestInfo;
    const page_url = `https://commons.wikimedia.org/wiki/${title}`;
    return {
      title,
      file_path: url.replace('https://upload.wikimedia.org', ''),
      thumbnail_url: thumburl,
      upload_date: parseISO(timestamp),
      page_url,
    };
  });
}

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

export async function fetchFileListByCategory(category: string, next?: string) {
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
  const data: CategoryFileMembersResponse = await callCommonsApi(queryParams);
  return data;
}
