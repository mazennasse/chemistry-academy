import { User, Level, Subject } from '../models/index.js';

import { hashPassword } from '../utils/auth.js';

import { httpError } from '../utils/httpError.js';

const clean = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  isActive: u.isActive,
  levelId: u.levelId,
  subjectId: u.subjectId,
  createdAt: u.createdAt
});

export const listStudents = async (_req, res) => {
  const students = await User.findAll({
    where: { role: 'student' },
    include: [
      {
        model: Level,
        as: 'level',
        attributes: ['id', 'name']
      },
      {
        model: Subject,
        as: 'subject',
        attributes: ['id', 'name']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    data: {
      students: students.map((student) => ({
        ...clean(student),
        level: student.level,
        subject: student.subject
      }))
    }
  });
};

export const createStudent = async (req, res) => {
  const { name, email, password, levelId, subjectId } = req.body;

  if (!name || !email || !password || password.length < 8) {
    throw httpError(
      400,
      'Name, email and a password of at least 8 characters are required.'
    );
  }

  if (!levelId || !subjectId) {
    throw httpError(
      400,
      'Level and subject are required.'
    );
  }

  const student = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: await hashPassword(password),
    role: 'student',
    levelId,
    subjectId
  });

  res.status(201).json({
    success: true,
    message: 'Student created.',
    data: { student: clean(student) }
  });
};

export const updateStudent = async (req, res) => {
  const student = await User.findOne({
    where: {
      id: req.params.id,
      role: 'student'
    }
  });

  if (!student) {
    throw httpError(404, 'Student not found.');
  }

  const {
    name,
    email,
    isActive,
    levelId,
    subjectId
  } = req.body;

  if (name !== undefined) {
    student.name = name.trim();
  }

  if (email !== undefined) {
    student.email = email.toLowerCase().trim();
  }

  if (isActive !== undefined) {
    student.isActive = Boolean(isActive);
  }

  if (levelId !== undefined) {
    const level = await Level.findByPk(levelId);

    if (!level) {
      throw httpError(400, 'Selected level does not exist.');
    }

    student.levelId = levelId;
  }

  if (subjectId !== undefined) {
    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      throw httpError(400, 'Selected subject does not exist.');
    }

    student.subjectId = subjectId;
  }

  await student.save();

  res.json({
    success: true,
    message: 'Student updated.',
    data: {
      student: clean(student)
    }
  });
};

export const changeStudentPassword = async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 8) {
    throw httpError(
      400,
      'Password must be at least 8 characters.'
    );
  }

  const student = await User.findOne({
    where: {
      id: req.params.id,
      role: 'student'
    }
  });

  if (!student) {
    throw httpError(404, 'Student not found.');
  }

  student.passwordHash = await hashPassword(password);

  await student.save();

  res.json({
    success: true,
    message: 'Student password changed.'
  });
};

export const deleteStudent = async (req, res) => {
  const student = await User.findOne({
    where: {
      id: req.params.id,
      role: 'student'
    }
  });

  if (!student) {
    throw httpError(404, 'Student not found.');
  }

  await student.destroy();

  res.json({
    success: true,
    message: 'Student deleted.'
  });
};