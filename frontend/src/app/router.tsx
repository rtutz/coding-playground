import { Loader } from "@/components/loader.tsx";
import NotFoundPage from "@/components/not-found.tsx";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// const LandingPage = lazy(() => import('./routes/landing.tsx'));
const ModulesPage = lazy(() => import("./routes/app/modules/modules.tsx"));
const ModulePage = lazy(() => import("./routes/app/modules/module.tsx"));

// Define the login component
const Login = () => {
    const correctPin = import.meta.env.VITE_TEACHER_PASS; // Replace with your desired PIN
    const userPin = prompt("Please enter your PIN:");

    if (userPin === correctPin) {
        localStorage.setItem("userRole", "teacher");
        alert("Login successful! Redirecting to modules...");
    } else {
        alert("Incorrect PIN. Redirecting to modules...");
    }

    // Redirect to /modules regardless of success or failure
    window.location.href = "/modules";
    return null;
};

// Define the logout component
const Logout = () => {
    localStorage.removeItem("userRole");
    alert("You have been logged out. Redirecting to modules...");
    window.location.href = "/modules";
    return null;
};

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
        path: "/login",
        element: <Login />,
    },
    {
        path: "/logout",
        element: <Logout />,
    },
    {
        // Error boundary route
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
