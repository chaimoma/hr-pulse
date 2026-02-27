'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Salary Predictor', href: '/predict' },
    ];

    return (
        <nav className="bg-[#1e293b] border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between h-14">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <span className="text-blue-400 font-bold text-lg tracking-tight">HR-PULSE</span>
                        </Link>
                        <div className="ml-8 flex space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${pathname === link.href
                                        ? 'text-white border-b-2 border-blue-500'
                                        : 'text-gray-400 hover:text-white'
                                        } inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors h-14`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-400">
                            Logged in as <span className="text-blue-200 font-semibold">{user.username}</span>
                        </span>
                        <button
                            onClick={logout}
                            className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
