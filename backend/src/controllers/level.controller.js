import { Level } from '../models/index.js';
import { httpError } from '../utils/httpError.js';

export async function getLevels(req, res) {
  const levels = await Level.findAll({
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: levels
  });
}

export async function createLevel(req, res) {
  const { name, description } = req.body;

  if (!name?.trim()) {
    throw httpError(400, 'Level name is required.');
  }

  const level = await Level.create({
    name: name.trim(),
    description: description?.trim() || null
  });

  res.status(201).json({
    success: true,
    message: 'Level created successfully.',
    data: level
  });
}

export async function updateLevel(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  const level = await Level.findByPk(id);

  if (!level) {
    throw httpError(404, 'Level not found.');
  }

  if (!name?.trim()) {
    throw httpError(400, 'Level name is required.');
  }

  await level.update({
    name: name.trim(),
    description: description?.trim() || null
  });

  res.json({
    success: true,
    message: 'Level updated successfully.',
    data: level
  });
}

export async function deleteLevel(req, res) {
  const { id } = req.params;

  const level = await Level.findByPk(id);

  if (!level) {
    throw httpError(404, 'Level not found.');
  }

  await level.destroy();

  res.json({
    success: true,
    message: 'Level deleted successfully.'
  });
}