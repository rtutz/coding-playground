import { Loader } from "@/components/loader.tsx";
import NotFoundPage from "@/components/not-found.tsx";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// const LandingPage = lazy(() => import('./routes/landing.tsx'));
const ModulesPage = lazy(() => import("./routes/app/modules/modules.tsx"));
const ModulePage = lazy(() => import("./routes/app/modules/module.tsx"));

const router = createBrowserRouter([
    {
        /* A temporary fix as the landing page is nonexistent for MVP */
        path: "/",
        element: <Navigate to="/modules" replace />,
    },
    {
        path: "/modules",
        element: (
            <Suspense fallback={<Loader/>}>
                <ModulesPage />
            </Suspense>
        ),
    },
    {
        path: "/modules/:moduleId/:materialId?",
        element: (
            <Suspense fallback={<Loader/>}>
                <ModulePage />
            </Suspense>
        ),
    },
    {
        // Error boundary route
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
