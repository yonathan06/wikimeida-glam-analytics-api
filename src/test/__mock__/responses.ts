export const MockCategoryFilesResponse = {
  batchcomplete: '',
  continue: {
    cmcontinue: 'file|12321',
    continue: '-||',
  },
  query: {
    categorymembers: [
      {
        pageid: 4234234,
        ns: 3,
        title: 'File:Albert Einstein Head.jpg',
      },
    ],
  },
};

export const MockFilesData = [
  {
    title: 'File:Albert Einstein Head.jpg',
    file_path: '/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg',
    thumbnail_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/250px-Albert_Einstein_Head.jpg',
    upload_date: '2014-11-25T19:59:28Z',
    page_url: 'https://commons.wikimedia.org/wiki/File:Albert_Einstein_Head.jpg',
  },
];
