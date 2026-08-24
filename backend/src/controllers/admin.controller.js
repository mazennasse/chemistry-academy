import { User, Lecture, Progress } from '../models/index.js';

export const dashboard = async (_req, res) => {
  const [students, lectures, completed] = await Promise.all([
    User.count({ where: { role: 'student' } }),
    Lecture.count({ where: { isPublished: true } }),
    Progress.count({ where: { completed: true } })
  ]);
  res.json({ success: true, data: { students, lectures, completedProgress: completed } });
};
