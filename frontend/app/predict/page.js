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
            setError(err.message || 'Prediction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { label: 'Job Title', name: 'job_title', type: 'text', placeholder: 'e.g. Senior Data Scientist', required: true },
        { label: 'Location', name: 'location', type: 'text', placeholder: 'e.g. New York, NY', required: true },
        { label: 'Rating (0-5)', name: 'rating', type: 'number', placeholder: 'e.g. 4.5', step: '0.1', min: '0', max: '5', required: true },
        { label: 'Founded Year', name: 'founded', type: 'number', placeholder: 'e.g. 2010', required: true },
        { label: 'Company Size', name: 'size', type: 'text', placeholder: 'e.g. 501 to 1000 employees', required: true },
        { label: 'Industry', name: 'industry', type: 'text', placeholder: 'e.g. IT Services', required: true },
        { label: 'Sector', name: 'sector', type: 'text', placeholder: 'e.g. Information Technology', required: true },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Salary Predictor</h1>
                <p className="text-lg text-gray-500 font-medium">
                    Estimate potential compensation using our AI-driven market analysis tool.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-3">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 ring-1 ring-black/5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formFields.map((field) => (
                                    <div key={field.name} className={`${field.name === 'job_title' ? 'md:col-span-2' : ''} space-y-2`}>
                                        <label className="text-sm font-bold text-gray-700 ml-1">{field.label}</label>
                                        <input
                                            {...field}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Job Description</label>
                                <textarea
                                    name="job_description"
                                    rows="4"
                                    value={formData.job_description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Paste the job description here for better accuracy..."
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Calculating Pulse...</span>
                                    </>
                                ) : (
                                    <span>Predict Salary</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 ring-1 ring-black/5 min-h-[300px] flex flex-col justify-center text-center">
                            {prediction ? (
                                <div className="animate-in zoom-in duration-500">
                                    <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Estimated Salary</p>
                                    <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                                        {prediction}
                                    </h2>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        Based on market trends and requirements for <span className="text-gray-900 font-bold">{formData.job_title}</span> in <span className="text-gray-900 font-bold">{formData.location}</span>.
                                    </p>
                                    <div className="mt-8 pt-8 border-t border-gray-50">
                                        <button onClick={() => setPrediction(null)} className="text-blue-600 font-bold text-sm hover:underline">Reset Prediction</button>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-red-600">
                                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Calculation Failed</h3>
                                    <p className="text-sm opacity-80">{error}</p>
                                </div>
                            ) : (
                                <div className="py-10">
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
                                        💰
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Ready to Calculate?</h3>
                                    <p className="text-gray-400 text-sm font-medium">Fill in the details to see the predicted compensation range.</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2rem] shadow-xl shadow-gray-200 text-white">
                            <h4 className="font-black text-lg mb-4 tracking-tight">AI Insights</h4>
                            <ul className="space-y-4 text-sm font-medium text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-blue-400 mr-2">✦</span>
                                    Detailed descriptions improve accuracy by 15-20%.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-400 mr-2">✦</span>
                                    Location is a primary factor in base salary calculation.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
