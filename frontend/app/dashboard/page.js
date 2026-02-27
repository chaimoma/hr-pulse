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

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Market Dashboard</h1>
                    <p className="text-gray-400 mt-1">Explore current opportunities and required skills</p>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter by skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#1e293b] border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm w-72 transition-all placeholder-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all border border-blue-500"
                    >
                        Search
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-900/20 text-red-400 p-4 rounded-xl mb-8 text-sm border border-red-900/50 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => fetchJobs()} className="underline font-bold hover:text-red-300">Retry</button>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-44 bg-[#1e293b]/50 rounded-xl animate-pulse border border-gray-800"></div>
                    ))}
                </div>
            ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[#1e293b]/30 rounded-2xl border border-dashed border-gray-700">
                    <div className="text-4xl mb-4 opacity-50">🔍</div>
                    <p className="text-gray-400">No jobs found matching your search criteria.</p>
                </div>
            )}
        </div>
    );
}
