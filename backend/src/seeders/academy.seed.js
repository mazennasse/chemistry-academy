import { Level, Subject } from '../models/index.js';

export async function seedAcademyData() {
  const levels = [
    'Primary 1',
    'Primary 2',
    'Primary 3',
    'Primary 4',
    'Primary 5',
    'Primary 6',
    'Preparatory 1',
    'Preparatory 2',
    'Preparatory 3',
    'Secondary 1',
    'Secondary 2',
    'Secondary 3'
  ];

  const subjects = [
    'Science',
    'Chemistry'
  ];

  for (const name of levels) {
    await Level.findOrCreate({
      where: { name },
      defaults: { name }
    });
  }

  for (const name of subjects) {
    await Subject.findOrCreate({
      where: { name },
      defaults: { name }
    });
  }

  console.log('Academy levels and subjects are ready.');
}