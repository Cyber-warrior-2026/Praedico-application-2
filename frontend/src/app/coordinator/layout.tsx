import { ReactNode } from 'react';
import CoordinatorSidebar from './_components/CoordinatorSidebar';

export default function CoordinatorLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
            <CoordinatorSidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
