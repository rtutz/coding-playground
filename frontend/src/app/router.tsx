import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// const LandingPage = lazy(() => import('./routes/landing.tsx'));
const ModulesPage = lazy(() => import('./routes/app/modules/modules.tsx'));
const ModulePage = lazy(() => import('./routes/app/modules/module.tsx'));

const router = createBrowserRouter([
  {
    /* A temporary fix as the landing page is nonexistent for MVP */
    path: '/',
    element: <Navigate to="/modules" replace /> 
  },
  {
    path: '/modules',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ModulesPage />
      </Suspense>
    ),
  },
  {
    path: '/modules/:moduleId',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ModulePage />
      </Suspense>
    ),
  },
]);

export default router;
