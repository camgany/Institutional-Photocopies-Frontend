import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  user: faker.name.fullName(),
  faculty: faker.company.name(),
  numberOfCopies: faker.datatype.number() ,
  numberOfPages: faker.datatype.number(),
  pickUpDate: faker.date.future().toString(),
  pickUpTime: faker.date.future().toString(),
  isColoured: faker.datatype.boolean(),
  isRinged : faker.datatype.boolean(),
  isFrontAndBack: faker.datatype.boolean(),
  document: faker.datatype.string(),
  specifications: faker.music.genre(),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
}));

export default users;
