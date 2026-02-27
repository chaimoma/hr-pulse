import SkillBadge from './SkillBadge';

export default function JobCard({ job }) {
    let skills = [];
    if (job.skills_extracted) {
        if (typeof job.skills_extracted === 'string') {
            try {
                const cleanString = job.skills_extracted.replace(/'/g, '"');
                const parsed = JSON.parse(cleanString);
                skills = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                skills = job.skills_extracted.split(',').map(s => s.trim()).filter(s => s !== '');
            }
        } else if (Array.isArray(job.skills_extracted)) {
            skills = job.skills_extracted;
        }
    }

    return (
        <div className="bg-[#1e293b] p-5 rounded-xl border border-gray-800 shadow-lg hover:border-blue-500/50 transition-all duration-300">
            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400">{job.job_title}</h3>
            <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                    {skills.length > 0 ? (
                        skills.map((skill, index) => (
                            <span key={index} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 text-xs">
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-600 italic">Not available</span>
                    )}
                </div>
            </div>
        </div>
    );
}
