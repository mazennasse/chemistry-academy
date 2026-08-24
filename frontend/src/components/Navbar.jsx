import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, FlaskConical } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/'); };
  return <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
      <Link to="/" className="flex items-center gap-2 font-bold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400 text-slate-950"><FlaskConical size={20}/></span> Chemistry<span className="text-cyan-300">Academy</span></Link>
      <div className="flex items-center gap-3">
        {user ? <>
          <Link to={user.role === 'admin' ? '/admin' : '/student'} className="rounded-xl px-4 py-2 text-sm text-slate-200 hover:bg-white/10">Dashboard</Link>
          <button onClick={signOut} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"><LogOut size={16}/> Logout</button>
        </> : <Link to="/login" className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"><LogIn size={16}/> Student / Admin Login</Link>}
      </div>
    </div>
  </nav>;
}
