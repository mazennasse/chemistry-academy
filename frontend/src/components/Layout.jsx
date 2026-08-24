import Navbar from './Navbar.jsx';
export default function Layout({ children }) { return <><Navbar/><main className="min-h-screen pt-20">{children}</main></>; }
