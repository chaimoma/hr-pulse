'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.register(username, password);
            router.push('/login?registered=true');
        } catch (err) {
            setError(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
            <div className="max-w-sm w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h1>
                    <p className="text-sm text-gray-500">Join the professional HR-PULSE platform</p>
                </div>

                <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-900/20 text-red-400 text-xs rounded border border-red-900/50">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#0f172a] border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all placeholder-gray-600"
                                placeholder="Username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0f172a] border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all placeholder-gray-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 text-sm border border-blue-500 shadow-lg shadow-blue-900/30"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-gray-500">
                    Already have an account? <Link href="/login" className="text-blue-400 font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
