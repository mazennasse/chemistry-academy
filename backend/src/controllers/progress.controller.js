import { Lecture, Progress } from '../models/index.js';
import { httpError } from '../utils/httpError.js';

export const completeLecture = async (req, res) => {
  const lecture = await Lecture.findOne({ where: { id: req.params.id, isPublished: true } });
  if (!lecture) throw httpError(404, 'Lecture not found.');
  const all = await Lecture.findAll({ where: { isPublished: true }, order: [['order', 'ASC']] });
  const index = all.findIndex((x) => x.id === lecture.id);
  if (index > 0) {
    const previousLecture = all[index - 1];
    const done = await Progress.findOne({ where: { userId: req.user.id, lectureId: previousLecture.id, completed: true } });
    if (!done) throw httpError(403, 'Complete the previous lecture first.');
  }
  await Progress.upsert({ userId: req.user.id, lectureId: lecture.id, completed: true, completedAt: new Date() });
  res.json({ success: true, message: 'Lecture marked as completed.' });
};

export const getMyProgress = async (req, res) => {
  const progress = await Progress.findAll({ where: { userId: req.user.id }, include: [{ model: Lecture, as: 'lecture', attributes: ['id', 'title', 'order'] }], order: [[{ model: Lecture, as: 'lecture' }, 'order', 'ASC']] });
  res.json({ success: true, data: { progress } });
};
