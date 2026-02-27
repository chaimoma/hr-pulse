'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const publicRoutes = ['/login', '/register'];
        if (!loading && !user && !publicRoutes.includes(pathname)) {
            router.push('/login');
        }
        if (!loading && user && publicRoutes.includes(pathname)) {
            router.push('/dashboard');
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Prevent flicker for protected routes
    const publicRoutes = ['/login', '/register'];
    if (!user && !publicRoutes.includes(pathname)) {
        return null;
    }

    return children;
}
