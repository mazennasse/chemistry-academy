import { Lock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LectureCard({ lecture, student = false }) {
  const open = student ? lecture.canOpen : false;
  return <div className="glass overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-cyan-300/30">
    <div className="relative aspect-video bg-slate-900">
      {lecture.thumbnailUrl ? <img src={lecture.thumbnailUrl} alt="" className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center bg-gradient-to-br from-cyan-500/15 to-blue-500/10"><PlayCircle size={50} className="text-cyan-300/80"/></div>}
      <div className="absolute left-3 top-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs">Lecture {lecture.order}</div>
      {student && <div className="absolute right-3 top-3">{lecture.completed ? <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-300"><CheckCircle2 size={14}/> Done</span> : !open ? <span className="flex items-center gap-1 rounded-full bg-slate-950/80 px-3 py-1 text-xs text-slate-300"><Lock size={14}/> Locked</span> : null}</div>}
    </div>
    <div className="p-5"><h3 className="text-lg font-semibold text-white">{lecture.title}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-400">{lecture.description || 'A focused lesson from the academy.'}</p>{student && <div className="mt-5">{open ? <Link to={`/student/lectures/${lecture.id}`} className="inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">{lecture.completed ? 'Watch again' : 'Continue'}</Link> : <span className="text-sm text-slate-500">Complete the previous lecture to unlock.</span>}</div>}</div>
  </div>;
}
