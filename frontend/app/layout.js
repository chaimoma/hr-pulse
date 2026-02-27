import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import './globals.css';

export const metadata = {
    title: 'HR-PULSE | Human Resources Dashboard',
    description: 'AI-powered HR management and salary prediction platform',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased text-gray-900 bg-[#f8fafc]">
                <AuthProvider>
                    <ProtectedRoute>
                        <div className="min-h-screen flex flex-col">
                            <Navbar />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <footer className="py-8 text-center text-sm text-gray-400 font-medium">
                                &copy; {new Date().getFullYear()} HR-PULSE. All rights reserved.
                            </footer>
                        </div>
                    </ProtectedRoute>
                </AuthProvider>
            </body>
        </html>
    );
}
