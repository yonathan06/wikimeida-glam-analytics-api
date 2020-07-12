import faker from 'faker';
import Glam from '@lib/models/Glam';

export const MockMediaList = [
  {
    name: 'Sphinx Metropolitan.jpg',
    filePath: '/wikipedia/commons/9/96/Sphinx_Metropolitan.jpg',
    thumbnailURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sphinx_Metropolitan.jpg/150px-Sphinx_Metropolitan.jpg',
    fileURL: 'http://commons.wikimedia.org/wiki/File:Sphinx_Metropolitan.jpg',
    uploadDate: '2008-02-29T15:04:26.000Z',
  },
  {
    name: 'The Burghers of Calais NY.jpg',
    filePath: '/wikipedia/commons/2/21/The_Burghers_of_Calais_NY.jpg',
    thumbnailURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/The_Burghers_of_Calais_NY.jpg/112px-The_Burghers_of_Calais_NY.jpg',
    fileURL: 'http://commons.wikimedia.org/wiki/File:The_Burghers_of_Calais_NY.jpg',
    uploadDate: '2008-02-29T13:43:37.000Z',
  },
  {
    name: "Nicolas Poussin - L'Enlèvement des Sabines (1634-5).jpg",
    filePath: "/wikipedia/commons/a/a8/Nicolas_Poussin_-_L'Enlèvement_des_Sabines_(1634-5).jpg",
    thumbnailURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nicolas_Poussin_-_L%27Enl%C3%A8vement_des_Sabines_%281634-5%29.jpg/150px-Nicolas_Poussin_-_L%27Enl%C3%A8vement_des_Sabines_%281634-5%29.jpg',
    fileURL:
      "http://commons.wikimedia.org/wiki/File:Nicolas_Poussin_-_L'Enlèvement_des_Sabines_(1634-5).jpg",
    uploadDate: '2018-04-01T10:40:42.000Z',
  },
];

export const newMockGlam = (): Partial<Glam> => {
  const name = faker.company.companyName();
  return {
    id: faker.helpers.slugify(name),
    name,
  };
};
