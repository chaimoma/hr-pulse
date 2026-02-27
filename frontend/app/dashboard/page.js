'use client';

import { useState, useEffect, useCallback } from 'react';
import { jobApi } from '@/lib/api';
import JobCard from '@/components/JobCard';

export default function DashboardPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchJobs = useCallback(async (skill = '') => {
        setLoading(true);
        setError('');
        try {
            let data;
            if (skill) {
                data = await jobApi.searchJobs(skill);
            } else {
                data = await jobApi.getJobs();
            }
            setJobs(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch jobs.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(searchQuery);
    };

    const clearSearch = () => {
        setSearchQuery('');
        fetchJobs();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Market Pulse</h1>
                <p className="text-lg text-gray-500 font-medium max-w-2xl">
                    Browse and search through our curated list of opportunities. Real-time skill extraction powered by AI.
                </p>
            </header>

            <section className="mb-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 ring-1 ring-black/5">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by skill (e.g., Python, React, SQL)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all duration-200 transform active:scale-95"
                    >
                        Search Skills
                    </button>
                </form>
            </section>

            {error && (
                <div className="mb-12 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center text-red-700 shadow-sm animate-in fade-in duration-500">
                    <div className="mr-4 p-2 bg-red-100 rounded-full">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="font-bold">{error}</p>
                    <button onClick={() => fetchJobs()} className="ml-auto text-sm font-black underline hover:text-red-800 transition-colors uppercase tracking-widest">Retry</button>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-64 animate-pulse">
                            <div className="h-6 bg-gray-100 rounded-full w-3/4 mb-6"></div>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="h-6 bg-gray-50 rounded-full w-16"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No jobs found</h3>
                    <p className="text-gray-500 font-medium">Try adjusting your search or clear filters to see more.</p>
                    <button
                        onClick={clearSearch}
                        className="mt-6 text-blue-600 font-black tracking-widest uppercase hover:text-blue-800 transition-colors text-sm"
                    >
                        Clear Search
                    </button>
                </div>
            )}
        </div>
    );
}
