import { Suspense } from "react";
import DocsClient from "./DocsClient";

export const dynamic = "force-dynamic";

export default function DocsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <DocsClient />
    </Suspense>
  );
}