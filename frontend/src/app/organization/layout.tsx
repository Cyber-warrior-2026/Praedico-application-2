import { ReactNode } from 'react';
import OrganizationSidebar from './_components/OrganizationSidebar';

export default function OrganizationLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
            <OrganizationSidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
