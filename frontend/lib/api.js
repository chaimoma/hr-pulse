const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

export const authApi = {
    login: (username, password) =>
        apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),
    register: (username, password) =>
        apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),
};

export const jobApi = {
    getJobs: () => apiRequest('/jobs'),
    searchJobs: (skill) => apiRequest(`/jobs/search?skill=${encodeURIComponent(skill)}`),
};

export const predictApi = {
    predictSalary: (data) =>
        apiRequest('/predict', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
