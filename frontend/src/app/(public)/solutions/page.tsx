import { Suspense } from "react";
import SolutionsClient from "./SolutionsClient";

export const dynamic = "force-dynamic";

export default function SolutionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SolutionsClient />
    </Suspense>
  );
}