import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Module } from "@/features/modules/types/module";
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
    <>
      <h1>Modules</h1>
      {modules && modules.length > 0 ? (
        <ul>
          {modules.map((module) => (
            <li key={module._id}>{module.title}</li>
          ))}
        </ul>
      ) : (
        <p>No modules found.</p>
      )}
    </>
  );
}
