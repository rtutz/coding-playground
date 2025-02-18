import { api } from "@/lib/api-client";
import { Material } from "@/types/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* 
Displays a specific module to the user. This module
should interact with all 3 types of problems. The 
user should be able to move across the materials
associated to this module.
*/
export default function Module() {
  /* 
  Make an API call to get the material id's associated
  to the module_id defined in the url param
  */
  const navigate = useNavigate();
  const { moduleId, materialId } = useParams<{
    moduleId: string;
    materialId?: string;
  }>();

  const {
    data: materials,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["materials"],
    queryFn: () =>
      api.get(`/modules/${moduleId}/materials`).then((response) => response.data),
  }) as { data: Material[]; isLoading: boolean; error: unknown };

  useEffect(() => {
    if (materials && materials.length > 0) {
      if (!materialId || !materials.some(m => m._id === materialId)) {
        navigate(`/modules/${moduleId}/${materials[0]._id}`, { replace: true });
      }
    }
  }, [materials, moduleId, materialId, navigate]);

  // TODO: Make a separate component for these
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (!materials || materials.length == 0) return <div>No materials</div>;

  /* 
  We have a few cases:
  - if no materials, display a message no materials for this module.
  - else,
      if url param contains a materialId, use that
      else, update URL to contain the ID of the first material. 
  */

  const currentMaterial = materials.find((m) => m._id === materialId);

  if (!currentMaterial) return <div>Invalid material</div>;

  switch (currentMaterial?.type) {
    case "lesson":
      return <div>Lesson</div>;
    case "problem":
      return <div>Problem</div>;
    case "quiz":
      return <div>Quiz</div>;
    default:
      return <div>DEFAULT</div>;
  }
}
