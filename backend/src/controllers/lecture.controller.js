import { Op } from 'sequelize';

import {
  Lecture,
  Progress,
  Level,
  Subject
} from '../models/index.js';

import { httpError } from '../utils/httpError.js';

import { deleteCloudinaryAsset } from '../services/cloudinary.service.js';

const publicLecture = (l) => ({
  id: l.id,
  title: l.title,
  description: l.description,
  order: l.order,
  videoDuration: l.videoDuration,
  thumbnailUrl: l.thumbnailUrl,
  isPublished: l.isPublished,
  levelId: l.levelId,
  subjectId: l.subjectId,
  level: l.level,
  subject: l.subject
});


// =========================
// PUBLIC LECTURES
// =========================

export const listPublicLectures = async (_req, res) => {

  const lectures = await Lecture.findAll({
    where: {
      isPublished: true
    },

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

    order: [['order', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      lectures: lectures.map(publicLecture)
    }
  });
};


// =========================
// STUDENT LECTURES
// =========================

export const listStudentLectures = async (req, res) => {

  const lectures = await Lecture.findAll({
    where: {
      isPublished: true,
      levelId: req.user.levelId,
      subjectId: req.user.subjectId
    },

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

    order: [['order', 'ASC']]
  });

  const progress = await Progress.findAll({
    where: {
      userId: req.user.id
    }
  });

  const completed = new Set(
    progress
      .filter((p) => p.completed)
      .map((p) => p.lectureId)
  );

  let previousComplete = true;

  const result = lectures.map((lecture) => {

    const isCompleted = completed.has(lecture.id);

    const canOpen = previousComplete;

    previousComplete = isCompleted;

    return {
      ...publicLecture(lecture),
      completed: isCompleted,
      canOpen
    };
  });

  res.json({
    success: true,
    data: {
      lectures: result
    }
  });
};


// =========================
// GET ONE LECTURE FOR STUDENT
// =========================

export const getLectureForStudent = async (req, res) => {

  const lecture = await Lecture.findOne({
    where: {
      id: req.params.id,
      isPublished: true,
      levelId: req.user.levelId,
      subjectId: req.user.subjectId
    },

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
    ]
  });

  if (!lecture) {
    throw httpError(404, 'Lecture not found.');
  }

  const previous = await Lecture.findOne({
    where: {
      isPublished: true,

      levelId: req.user.levelId,

      subjectId: req.user.subjectId,

      order: {
        [Op.lt]: lecture.order
      }
    },

    order: [['order', 'DESC']]
  });

  if (previous) {

    const previousProgress = await Progress.findOne({
      where: {
        userId: req.user.id,
        lectureId: previous.id,
        completed: true
      }
    });

    if (!previousProgress) {
      throw httpError(
        403,
        'Complete the previous lecture first.'
      );
    }
  }

  res.json({
    success: true,

    data: {
      lecture: {
        ...publicLecture(lecture),
        videoUrl: lecture.videoUrl
      }
    }
  });
};


// =========================
// ADMIN - LIST LECTURES
// =========================

export const listAdminLectures = async (_req, res) => {

  const lectures = await Lecture.findAll({

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

    order: [['order', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      lectures
    }
  });
};


// =========================
// CREATE LECTURE
// =========================

export const createLecture = async (req, res) => {

  const {
    title,
    description,
    order,
    videoUrl,
    videoPublicId,
    videoDuration,
    thumbnailUrl,
    isPublished,
    levelId,
    subjectId
  } = req.body;


  // =========================
  // BASIC VALIDATION
  // =========================

  if (
    !title ||
    !Number.isInteger(Number(order)) ||
    !videoUrl ||
    !videoPublicId
  ) {

    throw httpError(
      400,
      'Title, order and an uploaded video are required.'
    );
  }


  // =========================
  // LEVEL + SUBJECT REQUIRED
  // =========================

  if (!levelId || !subjectId) {

    throw httpError(
      400,
      'Level and subject are required.'
    );
  }


  // =========================
  // CHECK LEVEL
  // =========================

  const level = await Level.findByPk(levelId);

  if (!level) {

    throw httpError(
      400,
      'Selected level does not exist.'
    );
  }


  // =========================
  // CHECK SUBJECT
  // =========================

  const subject = await Subject.findByPk(subjectId);

  if (!subject) {

    throw httpError(
      400,
      'Selected subject does not exist.'
    );
  }


  // =========================
  // CHECK ORDER
  // =========================

  const exists = await Lecture.findOne({
    where: {
      order: Number(order),
      levelId,
      subjectId
    }
  });

  if (exists) {

    throw httpError(
      409,
      'That lecture order is already used for this level and subject.'
    );
  }


  // =========================
  // CREATE
  // =========================

  const lecture = await Lecture.create({

    title: title.trim(),

    description,

    order: Number(order),

    videoUrl,

    videoPublicId,

    videoDuration:
      videoDuration
        ? Number(videoDuration)
        : null,

    thumbnailUrl:
      thumbnailUrl || null,

    isPublished:
      Boolean(isPublished),

    levelId,

    subjectId
  });


  // =========================
  // RESPONSE
  // =========================

  res.status(201).json({

    success: true,

    message: 'Lecture created.',

    data: {
      lecture
    }
  });
};


// =========================
// UPDATE LECTURE
// =========================

export const updateLecture = async (req, res) => {

  const lecture = await Lecture.findByPk(
    req.params.id
  );

  if (!lecture) {
    throw httpError(
      404,
      'Lecture not found.'
    );
  }


  const {
    title,
    description,
    order,
    videoUrl,
    videoPublicId,
    videoDuration,
    thumbnailUrl,
    isPublished,
    levelId,
    subjectId
  } = req.body;


  // =========================
  // LEVEL
  // =========================

  if (levelId !== undefined) {

    const level = await Level.findByPk(levelId);

    if (!level) {

      throw httpError(
        400,
        'Selected level does not exist.'
      );
    }

    lecture.levelId = levelId;
  }


  // =========================
  // SUBJECT
  // =========================

  if (subjectId !== undefined) {

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {

      throw httpError(
        400,
        'Selected subject does not exist.'
      );
    }

    lecture.subjectId = subjectId;
  }


  // =========================
  // ORDER
  // =========================

  if (
    order !== undefined &&
    Number(order) !== lecture.order
  ) {

    const exists = await Lecture.findOne({

      where: {

        order: Number(order),

        levelId: lecture.levelId,

        subjectId: lecture.subjectId,

        id: {
          [Op.ne]: lecture.id
        }
      }
    });

    if (exists) {

      throw httpError(
        409,
        'That lecture order is already used for this level and subject.'
      );
    }

    lecture.order = Number(order);
  }


  // =========================
  // OTHER FIELDS
  // =========================

  if (title !== undefined) {
    lecture.title = title.trim();
  }

  if (description !== undefined) {
    lecture.description = description;
  }

  if (videoUrl !== undefined) {
    lecture.videoUrl = videoUrl;
  }

  if (videoPublicId !== undefined) {
    lecture.videoPublicId = videoPublicId;
  }

  if (videoDuration !== undefined) {

    lecture.videoDuration =
      videoDuration
        ? Number(videoDuration)
        : null;
  }

  if (thumbnailUrl !== undefined) {

    lecture.thumbnailUrl =
      thumbnailUrl || null;
  }

  if (isPublished !== undefined) {

    lecture.isPublished =
      Boolean(isPublished);
  }


  await lecture.save();


  res.json({

    success: true,

    message: 'Lecture updated.',

    data: {
      lecture
    }
  });
};


// =========================
// DELETE LECTURE
// =========================

export const deleteLecture = async (req, res) => {

  const lecture = await Lecture.findByPk(
    req.params.id
  );

  if (!lecture) {

    throw httpError(
      404,
      'Lecture not found.'
    );
  }


  await deleteCloudinaryAsset(
    lecture.videoPublicId,
    'video'
  ).catch(() => {});


  await lecture.destroy();


  res.json({

    success: true,

    message: 'Lecture deleted.'
  });
};