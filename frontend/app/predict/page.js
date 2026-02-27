'use client';

import { useState } from 'react';
import { predictApi } from '@/lib/api';

export default function PredictorPage() {
    const [formData, setFormData] = useState({
        job_title: '',
        job_description: '',
        rating: 0,
        location: '',
        size: '',
        industry: '',
        sector: '',
        founded: new Date().getFullYear(),
    });

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' || name === 'founded' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrediction(null);

        try {
            const result = await predictApi.predictSalary(formData);
            setPrediction(result.predicted_salary);
        } catch (err) {
            setError(err.message || 'Prediction failed.');
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { label: 'Job Title', name: 'job_title', type: 'text', placeholder: 'e.g. Data Scientist', required: true },
        { label: 'Location', name: 'location', type: 'text', placeholder: 'e.g. New York, NY', required: true },
        { label: 'Rating (0-5)', name: 'rating', type: 'number', step: '0.1', min: '0', max: '5', required: true },
        { label: 'Founded Year', name: 'founded', type: 'number', required: true },
        { label: 'Company Size', name: 'size', type: 'text', placeholder: 'e.g. 501-1000', required: true },
        { label: 'Industry', name: 'industry', type: 'text', required: true },
        { label: 'Sector', name: 'sector', type: 'text', required: true },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Salary Predictor</h1>
                <p className="text-gray-400 mt-1">AI-based compensation estimates for your role</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {formFields.map((field) => (
                                <div key={field.name} className={`${field.name === 'job_title' ? 'md:col-span-2' : ''}`}>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">{field.label}</label>
                                    <input
                                        {...field}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full bg-[#0f172a] border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all placeholder-gray-600"
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Job Description</label>
                            <textarea
                                name="job_description"
                                rows="4"
                                value={formData.job_description}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f172a] border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all resize-none placeholder-gray-600"
                                placeholder="Paste the job description here..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/30 transform active:scale-[0.99] border border-blue-500"
                        >
                            {loading ? 'Crunching Numbers...' : 'Predict Salary'}
                        </button>
                    </form>
                </div>

                <div className="bg-[#1e293b]/40 p-10 rounded-2xl border border-dashed border-gray-800 min-h-[450px] flex flex-col justify-center text-center">
                    {prediction ? (
                        <div className="animate-in zoom-in duration-300">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Estimated Salary</p>
                            <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">{prediction}</h2>
                            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 max-w-sm mx-auto">
                                <p className="text-gray-400 text-sm">
                                    Based on training data for <span className="text-blue-200 font-semibold">{formData.job_title}</span> in {formData.location}.
                                </p>
                            </div>
                            <button onClick={() => setPrediction(null)} className="mt-8 text-xs font-bold text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-widest">Clear Prediction</button>
                        </div>
                    ) : error ? (
                        <div className="text-red-400 animate-in fade-in duration-300">
                            <div className="text-5xl mb-4 opacity-50">⚠️</div>
                            <h3 className="text-xl font-bold mb-1">Prediction Error</h3>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            <div className="text-6xl mb-6 opacity-30">💰</div>
                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Estimate?</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">Enter company details and job description to see predicted compensation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
