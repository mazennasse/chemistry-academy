import { Subject } from '../models/index.js';
import { httpError } from '../utils/httpError.js';

export async function getSubjects(req, res) {
  const subjects = await Subject.findAll({
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: subjects
  });
}

export async function createSubject(req, res) {
  const { name, description } = req.body;

  if (!name?.trim()) {
    throw httpError(400, 'Subject name is required.');
  }

  const subject = await Subject.create({
    name: name.trim(),
    description: description?.trim() || null
  });

  res.status(201).json({
    success: true,
    message: 'Subject created successfully.',
    data: subject
  });
}

export async function updateSubject(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  const subject = await Subject.findByPk(id);

  if (!subject) {
    throw httpError(404, 'Subject not found.');
  }

  if (!name?.trim()) {
    throw httpError(400, 'Subject name is required.');
  }

  await subject.update({
    name: name.trim(),
    description: description?.trim() || null
  });

  res.json({
    success: true,
    message: 'Subject updated successfully.',
    data: subject
  });
}

export async function deleteSubject(req, res) {
  const { id } = req.params;

  const subject = await Subject.findByPk(id);

  if (!subject) {
    throw httpError(404, 'Subject not found.');
  }

  await subject.destroy();

  res.json({
    success: true,
    message: 'Subject deleted successfully.'
  });
}