import faker from 'faker';
import Glam from '@lib/models/Glam';
import GlamMediaItem from '@lib/models/GlamMediaItem';

export const MockMediaList: Partial<GlamMediaItem>[] = [
  {
    title: 'Sphinx Metropolitan.jpg',
    file_path: '/wikipedia/commons/9/96/Sphinx_Metropolitan.jpg',
    thumbnail_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sphinx_Metropolitan.jpg/150px-Sphinx_Metropolitan.jpg',
    page_url: 'http://commons.wikimedia.org/wiki/File:Sphinx_Metropolitan.jpg',
    upload_date: '2008-02-29T15:04:26.000Z',
  },
  {
    title: 'The Burghers of Calais NY.jpg',
    file_path: '/wikipedia/commons/2/21/The_Burghers_of_Calais_NY.jpg',
    thumbnail_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/The_Burghers_of_Calais_NY.jpg/112px-The_Burghers_of_Calais_NY.jpg',
    page_url: 'http://commons.wikimedia.org/wiki/File:The_Burghers_of_Calais_NY.jpg',
    upload_date: '2008-02-29T13:43:37.000Z',
  },
  {
    title: "Nicolas Poussin - L'Enlèvement des Sabines (1634-5).jpg",
    file_path: "/wikipedia/commons/a/a8/Nicolas_Poussin_-_L'Enlèvement_des_Sabines_(1634-5).jpg",
    thumbnail_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nicolas_Poussin_-_L%27Enl%C3%A8vement_des_Sabines_%281634-5%29.jpg/150px-Nicolas_Poussin_-_L%27Enl%C3%A8vement_des_Sabines_%281634-5%29.jpg',
    page_url:
      "http://commons.wikimedia.org/wiki/File:Nicolas_Poussin_-_L'Enlèvement_des_Sabines_(1634-5).jpg",
    upload_date: '2018-04-01T10:40:42.000Z',
  },
];

export class MockGlam {
  name: string;
  id: string;
  constructor() {
    this.name = faker.company.companyName();
    this.id = faker.helpers.slugify(this.name);
  }
}

export class MockUser {
  username: string;
  password: string;
  constructor() {
    this.username = faker.internet.userName();
    this.password = faker.internet.password();
  }
}
