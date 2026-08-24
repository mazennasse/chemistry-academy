import { Level, Subject } from '../models/index.js';

export const getCatalog = async (_req, res) => {
  const [levels, subjects] = await Promise.all([
    Level.findAll({
      order: [['id', 'ASC']]
    }),

    Subject.findAll({
      order: [['id', 'ASC']]
    })
  ]);

  res.json({
    success: true,
    data: {
      levels,
      subjects
    }
  });
};