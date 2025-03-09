// app.tsx

import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./router";
import { ThemeProvider } from "./provider";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <RouterProvider router={router} />
                <Toaster />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
