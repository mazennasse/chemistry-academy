import { useEffect, useState } from 'react';

import {
  Users,
  BookOpen,
  Settings,
  Trash2,
  KeyRound,
  Plus,
  Pencil,
  Power,
  Save
} from 'lucide-react';

import Layout from '../components/Layout.jsx';
import StatCard from '../components/StatCard.jsx';
import UploadButton from '../components/UploadButton.jsx';
import { api, messageFromError } from '../lib/api.js';

const blankStudent = {
  name: '',
  email: '',
  password: '',
  levelId: '',
  subjectId: ''
};

const blankLecture = {
  title: '',
  description: '',
  order: 1,
  isPublished: false,
  videoUrl: '',
  videoPublicId: '',
  videoDuration: null,
  thumbnailUrl: '',
  levelId: '',
  subjectId: ''
};

const blankLevel = {
  name: '',
  description: ''
};

const blankSubject = {
  name: '',
  description: ''
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    lectures: 0,
    completedProgress: 0
  });

  const [students, setStudents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [settings, setSettings] = useState(null);

  // =========================
  // LEVELS & SUBJECTS
  // =========================

  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [level, setLevel] = useState(blankLevel);
  const [subject, setSubject] = useState(blankSubject);

  const [tab, setTab] = useState('overview');

  const [student, setStudent] = useState(blankStudent);
  const [lecture, setLecture] = useState(blankLecture);

  const [editingLecture, setEditingLecture] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // =========================
  // LOAD ALL DATA
  // =========================

  const load = async () => {
    try {
      const [
        s,
        st,
        l,
        set,
        levelsResponse,
        subjectsResponse
      ] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/students'),
        api.get('/lectures/admin'),
        api.get('/settings'),
        api.get('/levels'),
        api.get('/subjects')
      ]);

      setStats(s.data.data);

      setStudents(st.data.data.students);

      setLectures(l.data.data.lectures);

      setSettings(set.data.data.settings);

      setLevels(levelsResponse.data.data);

      setSubjects(subjectsResponse.data.data);
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // FLASH MESSAGE
  // =========================

  const flash = (m) => {
    setMessage(m);
    setError('');

    setTimeout(() => {
      setMessage('');
    }, 2500);
  };

  // =========================
  // STUDENTS
  // =========================

  const createStudent = async (e) => {
    e.preventDefault();

    try {
      await api.post('/students', {
        ...student,
        levelId: Number(student.levelId),
        subjectId: Number(student.subjectId)
      });

      setStudent(blankStudent);

      await load();

      flash('Student created.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  const toggleStudent = async (s) => {
    try {
      await api.patch(`/students/${s.id}`, {
        isActive: !s.isActive
      });

      await load();
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  const removeStudent = async (s) => {
    if (!confirm(`Delete ${s.name}?`)) return;

    try {
      await api.delete(`/students/${s.id}`);

      await load();

      flash('Student deleted.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  const changePassword = async (s) => {
    const p = prompt('New password (minimum 8 characters):');

    if (!p) return;

    try {
      await api.patch(`/students/${s.id}/password`, {
        password: p
      });

      flash('Password changed.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  // =========================
  // LEVELS
  // =========================

  const createLevel = async (e) => {
    e.preventDefault();

    try {
      await api.post('/levels', {
        name: level.name,
        description: level.description
      });

      setLevel(blankLevel);

      await load();

      flash('Level created.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  const deleteLevel = async (id) => {
    if (!confirm('Delete this level?')) return;

    try {
      await api.delete(`/levels/${id}`);

      await load();

      flash('Level deleted.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  // =========================
  // SUBJECTS
  // =========================

  const createSubject = async (e) => {
    e.preventDefault();

    try {
      await api.post('/subjects', {
        name: subject.name,
        description: subject.description
      });

      setSubject(blankSubject);

      await load();

      flash('Subject created.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  const deleteSubject = async (id) => {
    if (!confirm('Delete this subject?')) return;

    try {
      await api.delete(`/subjects/${id}`);

      await load();

      flash('Subject deleted.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  // =========================
  // LECTURES
  // =========================

  const saveLecture = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...lecture,
        levelId: Number(lecture.levelId),
        subjectId: Number(lecture.subjectId),
        order: Number(lecture.order)
      };

      if (editingLecture) {
        await api.patch(
          `/lectures/${editingLecture.id}`,
          data
        );
      } else {
        await api.post('/lectures', data);
      }

      const wasEditing = Boolean(editingLecture);

      setLecture(blankLecture);

      setEditingLecture(null);

      await load();

      flash(
        wasEditing
          ? 'Lecture updated.'
          : 'Lecture created.'
      );
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  const removeLecture = async (l) => {
    if (!confirm(`Delete ${l.title}?`)) return;

    try {
      await api.delete(`/lectures/${l.id}`);

      await load();

      flash('Lecture deleted.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  const editLecture = (l) => {
    setEditingLecture(l);

    setLecture({
      title: l.title || '',
      description: l.description || '',
      order: l.order || 1,
      isPublished: Boolean(l.isPublished),
      videoUrl: l.videoUrl || '',
      videoPublicId: l.videoPublicId || '',
      videoDuration: l.videoDuration ?? null,
      thumbnailUrl: l.thumbnailUrl || '',
      levelId: l.levelId ?? '',
      subjectId: l.subjectId ?? ''
    });

    setTab('lectures');
  };

  // =========================
  // SETTINGS
  // =========================

  const saveSettings = async (e) => {
    e.preventDefault();

    try {
      await api.put('/settings', settings);

      flash('Site settings saved.');
    } catch (e) {
      setError(messageFromError(e));
    }
  };

  const uploadTeacher = (asset) => {
    setSettings({
      ...settings,
      teacherImageUrl: asset.url,
      teacherImagePublicId: asset.publicId
    });
  };

  // =========================
  // UI
  // =========================

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-sm font-bold uppercase tracking-[.25em] text-cyan-300">
              Admin control center
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Teacher Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">

            {[
              'overview',
              'students',
              'lectures',
              'catalog',
              'settings'
            ].map((x) => (
              <button
                key={x}
                onClick={() => setTab(x)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  tab === x
                    ? 'bg-cyan-400 text-slate-950'
                    : 'border border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                {x[0].toUpperCase() + x.slice(1)}
              </button>
            ))}

          </div>
        </div>

        {/* =========================
            MESSAGES
        ========================= */}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {/* =========================
            OVERVIEW
        ========================= */}

        {tab === 'overview' && (
          <>
            <div className="grid gap-4 md:grid-cols-3">

              <StatCard
                icon={<Users />}
                label="Students"
                value={stats.students}
              />

              <StatCard
                icon={<BookOpen />}
                label="Published lectures"
                value={stats.lectures}
              />

              <StatCard
                icon={<Settings />}
                label="Completed lessons"
                value={stats.completedProgress}
              />

            </div>

            <div className="glass mt-6 rounded-3xl p-7">

              <h2 className="text-xl font-bold text-white">
                Quick actions
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-3">

                <button
                  onClick={() => setTab('students')}
                  className="rounded-2xl bg-white/5 p-5 text-left hover:bg-white/10"
                >
                  <Users className="mb-3 text-cyan-300" />
                  Manage students
                </button>

                <button
                  onClick={() => setTab('lectures')}
                  className="rounded-2xl bg-white/5 p-5 text-left hover:bg-white/10"
                >
                  <BookOpen className="mb-3 text-cyan-300" />
                  Manage lectures
                </button>

                <button
                  onClick={() => setTab('settings')}
                  className="rounded-2xl bg-white/5 p-5 text-left hover:bg-white/10"
                >
                  <Settings className="mb-3 text-cyan-300" />
                  Edit website
                </button>

              </div>
            </div>
          </>
        )}

        {/* =========================
            STUDENTS
        ========================= */}

        {tab === 'students' && (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* ADD STUDENT */}

            <form
              onSubmit={createStudent}
              className="glass h-fit rounded-3xl p-6"
            >

              <h2 className="text-xl font-bold text-white">
                Add student
              </h2>

              <Field
                label="Name"
                value={student.name}
                onChange={(v) =>
                  setStudent({
                    ...student,
                    name: v
                  })
                }
              />

              <Field
                label="Email"
                type="email"
                value={student.email}
                onChange={(v) =>
                  setStudent({
                    ...student,
                    email: v
                  })
                }
              />

              <Field
                label="Password"
                type="text"
                value={student.password}
                onChange={(v) =>
                  setStudent({
                    ...student,
                    password: v
                  })
                }
              />

              {/* LEVEL */}

              <label className="mt-4 block text-sm text-slate-300">

                Level

                <select
                  required
                  value={student.levelId}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      levelId: e.target.value
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white outline-none focus:border-cyan-300/50"
                >

                  <option value="">
                    Select level
                  </option>

                  {levels.map((level) => (
                    <option
                      key={level.id}
                      value={level.id}
                    >
                      {level.name}
                    </option>
                  ))}

                </select>

              </label>

              {/* SUBJECT */}

              <label className="mt-4 block text-sm text-slate-300">

                Subject

                <select
                  required
                  value={student.subjectId}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      subjectId: e.target.value
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white outline-none focus:border-cyan-300/50"
                >

                  <option value="">
                    Select subject
                  </option>

                  {subjects.map((subject) => (
                    <option
                      key={subject.id}
                      value={subject.id}
                    >
                      {subject.name}
                    </option>
                  ))}

                </select>

              </label>

              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950">

                <Plus size={18} />

                Create student

              </button>

            </form>

            {/* STUDENTS LIST */}

            <div className="glass overflow-hidden rounded-3xl">

              <div className="border-b border-white/10 p-6">

                <h2 className="text-xl font-bold text-white">
                  Students
                </h2>

              </div>

              <div className="divide-y divide-white/5">

                {students.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <div className="font-semibold text-white">
                        {s.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        {s.email}
                      </div>

                      <div className="mt-1 text-xs text-slate-600">

                        {s.level?.name && (
                          <span>
                            Level: {s.level.name}
                          </span>
                        )}

                        {s.subject?.name && (
                          <span className="ml-3">
                            Subject: {s.subject.name}
                          </span>
                        )}

                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          s.isActive
                            ? 'bg-emerald-400/10 text-emerald-300'
                            : 'bg-rose-400/10 text-rose-300'
                        }`}
                      >
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>

                      <button
                        title="Activate/deactivate"
                        onClick={() => toggleStudent(s)}
                        className="rounded-lg p-2 hover:bg-white/10"
                      >
                        <Power size={16} />
                      </button>

                      <button
                        title="Change password"
                        onClick={() => changePassword(s)}
                        className="rounded-lg p-2 hover:bg-white/10"
                      >
                        <KeyRound size={16} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => removeStudent(s)}
                        className="rounded-lg p-2 text-rose-300 hover:bg-rose-400/10"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>
                ))}

                {!students.length && (
                  <p className="p-6 text-slate-500">
                    No students yet.
                  </p>
                )}

              </div>

            </div>

          </div>
        )}

        {/* =========================
            LECTURES
        ========================= */}

        {tab === 'lectures' && (
          <div className="grid gap-6 lg:grid-cols-[390px_1fr]">

            {/* LECTURE FORM */}

            <form
              onSubmit={saveLecture}
              className="glass h-fit rounded-3xl p-6"
            >

              <h2 className="text-xl font-bold text-white">
                {editingLecture
                  ? 'Edit lecture'
                  : 'Add lecture'}
              </h2>

              <Field
                label="Title"
                value={lecture.title}
                onChange={(v) =>
                  setLecture({
                    ...lecture,
                    title: v
                  })
                }
              />

              <Field
                label="Order"
                type="number"
                value={lecture.order}
                onChange={(v) =>
                  setLecture({
                    ...lecture,
                    order: Number(v)
                  })
                }
              />

              {/* LEVEL */}

              <label className="mt-4 block text-sm text-slate-300">

                Level

                <select
                  required
                  value={lecture.levelId}
                  onChange={(e) =>
                    setLecture({
                      ...lecture,
                      levelId: e.target.value
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white outline-none focus:border-cyan-300/50"
                >

                  <option value="">
                    Select level
                  </option>

                  {levels.map((level) => (
                    <option
                      key={level.id}
                      value={level.id}
                    >
                      {level.name}
                    </option>
                  ))}

                </select>

              </label>

              {/* SUBJECT */}

              <label className="mt-4 block text-sm text-slate-300">

                Subject

                <select
                  required
                  value={lecture.subjectId}
                  onChange={(e) =>
                    setLecture({
                      ...lecture,
                      subjectId: e.target.value
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white outline-none focus:border-cyan-300/50"
                >

                  <option value="">
                    Select subject
                  </option>

                  {subjects.map((subject) => (
                    <option
                      key={subject.id}
                      value={subject.id}
                    >
                      {subject.name}
                    </option>
                  ))}

                </select>

              </label>

              {/* DESCRIPTION */}

              <label className="mt-4 block text-sm text-slate-300">

                Description

                <textarea
                  value={lecture.description || ''}
                  onChange={(e) =>
                    setLecture({
                      ...lecture,
                      description: e.target.value
                    })
                  }
                  className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 outline-none"
                />

              </label>

              {/* VIDEO */}

              <div className="mt-5">

                <UploadButton
                  type="video"
                  onUploaded={(a) =>
                    setLecture({
                      ...lecture,
                      videoUrl: a.url,
                      videoPublicId: a.publicId,
                      videoDuration: a.duration
                    })
                  }
                />

                {lecture.videoUrl && (
                  <p className="mt-2 break-all text-xs text-emerald-300">
                    Video uploaded ✓
                  </p>
                )}

              </div>

              {/* PUBLISH */}

              <label className="mt-4 flex items-center gap-3 text-sm text-slate-300">

                <input
                  type="checkbox"
                  checked={lecture.isPublished}
                  onChange={(e) =>
                    setLecture({
                      ...lecture,
                      isPublished: e.target.checked
                    })
                  }
                />

                Publish lecture

              </label>

              {/* BUTTONS */}

              <div className="mt-5 flex gap-2">

                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950"
                >

                  <Save size={17} />

                  {editingLecture
                    ? 'Save changes'
                    : 'Create lecture'}

                </button>

                {editingLecture && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLecture(null);
                      setLecture(blankLecture);
                    }}
                    className="rounded-xl border border-white/10 px-4"
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

            {/* LECTURES LIST */}

            <div className="space-y-3">

              {lectures.map((l) => (
                <div
                  key={l.id}
                  className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <div className="text-xs text-cyan-300">

                      #{l.order} ·{' '}

                      {l.isPublished
                        ? 'Published'
                        : 'Draft'}

                    </div>

                    <h3 className="mt-1 font-semibold text-white">
                      {l.title}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {l.description}
                    </p>

                    <div className="mt-2 text-xs text-slate-500">

                      {l.level?.name && (
                        <span>
                          Level: {l.level.name}
                        </span>
                      )}

                      {l.subject?.name && (
                        <span className="ml-3">
                          Subject: {l.subject.name}
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => editLecture(l)}
                      className="rounded-lg p-2 hover:bg-white/10"
                      title="Edit lecture"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => removeLecture(l)}
                      className="rounded-lg p-2 text-rose-300 hover:bg-rose-400/10"
                      title="Delete lecture"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>
              ))}

              {!lectures.length && (
                <div className="glass rounded-2xl p-6 text-slate-500">
                  No lectures yet.
                </div>
              )}

            </div>

          </div>
        )}

        {/* =========================
            CATALOG
        ========================= */}

        {tab === 'catalog' && (
          <div className="grid gap-6 md:grid-cols-2">

            {/* LEVELS */}

            <div className="glass rounded-3xl p-7">

              <div className="flex items-center gap-3">

                <BookOpen className="text-cyan-300" />

                <div>

                  <h2 className="text-xl font-bold text-white">
                    Levels
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage student education levels.
                  </p>

                </div>

              </div>

              <form
                onSubmit={createLevel}
                className="mt-6"
              >

                <Field
                  label="Level name"
                  value={level.name}
                  onChange={(v) =>
                    setLevel({
                      ...level,
                      name: v
                    })
                  }
                />

                <label className="mt-4 block text-sm text-slate-300">

                  Description

                  <textarea
                    value={level.description}
                    onChange={(e) =>
                      setLevel({
                        ...level,
                        description: e.target.value
                      })
                    }
                    className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white outline-none focus:border-cyan-300/50"
                  />

                </label>

                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950"
                >

                  <Plus size={18} />

                  Add level

                </button>

              </form>

              <div className="mt-6 space-y-2">

                {levels.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                  >

                    <div>

                      <p className="font-semibold text-white">
                        {item.name}
                      </p>

                      {item.description && (
                        <p className="mt-1 text-xs text-slate-500">
                          {item.description}
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() => deleteLevel(item.id)}
                      className="rounded-lg p-2 text-rose-300 hover:bg-rose-400/10"
                      title="Delete level"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                ))}

                {!levels.length && (
                  <p className="text-sm text-slate-500">
                    No levels yet.
                  </p>
                )}

              </div>

            </div>

            {/* SUBJECTS */}

            <div className="glass rounded-3xl p-7">

              <div className="flex items-center gap-3">

                <BookOpen className="text-cyan-300" />

                <div>

                  <h2 className="text-xl font-bold text-white">
                    Subjects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage subjects such as Science and Chemistry.
                  </p>

                </div>

              </div>

              <form
                onSubmit={createSubject}
                className="mt-6"
              >

                <Field
                  label="Subject name"
                  value={subject.name}
                  onChange={(v) =>
                    setSubject({
                      ...subject,
                      name: v
                    })
                  }
                />

                <label className="mt-4 block text-sm text-slate-300">

                  Description

                  <textarea
                    value={subject.description}
                    onChange={(e) =>
                      setSubject({
                        ...subject,
                        description: e.target.value
                      })
                    }
                    className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white outline-none focus:border-cyan-300/50"
                  />

                </label>

                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950"
                >

                  <Plus size={18} />

                  Add subject

                </button>

              </form>

              <div className="mt-6 space-y-2">

                {subjects.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                  >

                    <div>

                      <p className="font-semibold text-white">
                        {item.name}
                      </p>

                      {item.description && (
                        <p className="mt-1 text-xs text-slate-500">
                          {item.description}
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() => deleteSubject(item.id)}
                      className="rounded-lg p-2 text-rose-300 hover:bg-rose-400/10"
                      title="Delete subject"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                ))}

                {!subjects.length && (
                  <p className="text-sm text-slate-500">
                    No subjects yet.
                  </p>
                )}

              </div>

            </div>

          </div>
        )}

        {/* =========================
            SETTINGS
        ========================= */}

        {tab === 'settings' && settings && (
          <form
            onSubmit={saveSettings}
            className="glass max-w-3xl rounded-3xl p-7"
          >

            <h2 className="text-2xl font-bold text-white">
              Website content
            </h2>

            <Field
              label="Teacher name"
              value={settings.teacherName}
              onChange={(v) =>
                setSettings({
                  ...settings,
                  teacherName: v
                })
              }
            />

            <Field
              label="Headline"
              value={settings.headline}
              onChange={(v) =>
                setSettings({
                  ...settings,
                  headline: v
                })
              }
            />

            <label className="mt-4 block text-sm text-slate-300">

              Bio

              <textarea
                value={settings.bio || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bio: e.target.value
                  })
                }
                className="mt-2 min-h-32 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 outline-none"
              />

            </label>

            <div className="mt-6 flex items-center gap-5">

              {settings.teacherImageUrl && (
                <img
                  src={settings.teacherImageUrl}
                  className="h-24 w-20 rounded-xl object-cover"
                  alt="Teacher"
                />
              )}

              <UploadButton
                type="image"
                onUploaded={uploadTeacher}
              />

            </div>

            <button
              type="submit"
              className="mt-7 flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
            >

              <Save size={17} />

              Save website

            </button>

          </form>
        )}

      </div>
    </Layout>
  );
}

// =========================
// FIELD COMPONENT
// =========================

function Field({
  label,
  type = 'text',
  value,
  onChange
}) {
  return (
    <label className="mt-4 block text-sm text-slate-300">

      {label}

      <input
        type={type}
        required
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white outline-none focus:border-cyan-300/50"
      />

    </label>
  );
}