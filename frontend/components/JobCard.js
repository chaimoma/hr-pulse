import SkillBadge from './SkillBadge';

export default function JobCard({ job }) {
    // Parse skills from string if it's stored as a stringified list or similar
    let skills = [];
    try {
        if (typeof job.skills_extracted === 'string') {
            // Assuming it might be a JSON string like "['Python', 'SQL']"
            // Quick fix for Python style lists if necessary
            const cleanString = job.skills_extracted.replace(/'/g, '"');
            skills = JSON.parse(cleanString);
        } else if (Array.isArray(job.skills_extracted)) {
            skills = job.skills_extracted;
        }
    } catch (e) {
        console.error('Failed to parse skills:', job.skills_extracted);
        skills = [];
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {job.job_title}
                </h3>
                <div className="mt-auto">
                    <p className="text-xs font-uppercase tracking-wider text-gray-400 mb-3 font-semibold uppercase">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                            skills.slice(0, 8).map((skill, index) => (
                                <SkillBadge key={index} skill={skill} />
                            ))
                        ) : (
                            <span className="text-sm text-gray-400 italic">No skills specified</span>
                        )}
                        {skills.length > 8 && (
                            <span className="text-xs text-gray-400 font-medium py-1">+{skills.length - 8} more</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
