import { User } from './User.js';
import { Lecture } from './Lecture.js';
import { Progress } from './Progress.js';
import { SiteSetting } from './SiteSetting.js';
import { Level } from './Level.js';
import { Subject } from './Subject.js';

User.hasMany(Progress, {
  foreignKey: 'userId',
  as: 'progress'
});

Progress.belongsTo(User, {
  foreignKey: 'userId',
  as: 'student'
});

Lecture.hasMany(Progress, {
  foreignKey: 'lectureId',
  as: 'progress'
});

Progress.belongsTo(Lecture, {
  foreignKey: 'lectureId',
  as: 'lecture'
});


/* =========================
   Level Associations
========================= */

Level.hasMany(User, {
  foreignKey: 'levelId',
  as: 'students'
});

User.belongsTo(Level, {
  foreignKey: 'levelId',
  as: 'level'
});

Level.hasMany(Lecture, {
  foreignKey: 'levelId',
  as: 'lectures'
});

Lecture.belongsTo(Level, {
  foreignKey: 'levelId',
  as: 'level'
});


/* =========================
   Subject Associations
========================= */

Subject.hasMany(User, {
  foreignKey: 'subjectId',
  as: 'students'
});

User.belongsTo(Subject, {
  foreignKey: 'subjectId',
  as: 'subject'
});

Subject.hasMany(Lecture, {
  foreignKey: 'subjectId',
  as: 'lectures'
});

Lecture.belongsTo(Subject, {
  foreignKey: 'subjectId',
  as: 'subject'
});


export {
  User,
  Lecture,
  Progress,
  SiteSetting,
  Level,
  Subject
};