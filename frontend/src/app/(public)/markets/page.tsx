import { Suspense } from "react";
import MarketsClient from "./MarketsClient";

export const dynamic = "force-dynamic";

export default function MarketsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0E1217]" />}>
            <MarketsClient />
        </Suspense>
    );
}
