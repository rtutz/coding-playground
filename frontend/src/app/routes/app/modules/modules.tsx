import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Module } from "@/features/modules/types/module";
import { ModuleCard } from "@/features/modules/components/moduleCard";
/* 
Displays all the modules in the app. A user should
be able to click on a specific module and get rerouted 
to it (which should then display module.tsx)
*/
export default function Modules() {
    const {
        data: modules,
        isLoading,
        error,
      } = useQuery({
        queryKey: ["modules"],
        queryFn: () => api.get("/modules").then((response) => response.data),
      }) as { data: Module[]; isLoading: boolean; error: unknown };
      
      

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Modules
        </h1>
        {modules && modules.length > 0 ? (
          <div className="space-y-6">
            {modules.map((module) => (
              <ModuleCard key={module._id} module={module} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No modules found.</p>
        )}
      </div>
    </div>
  )
  
}
