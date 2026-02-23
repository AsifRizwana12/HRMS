const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // Remove trailing slash if exists
        const cleanUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
        // Ensure it has /api prefix if missing
        return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
    }
    // Fallback for production
    if (window.location.hostname !== 'localhost') {
        return 'https://hrms-1k8b.onrender.com/api';
    }
    return 'http://localhost:5001/api';
};

const API_BASE_URL = getApiUrl();

export default API_BASE_URL;
