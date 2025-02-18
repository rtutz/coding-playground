// Module.ts
// import { Lesson } from '@/features/lesson/types/lesson';
// import { Problem } from '@/features/problem/types/problem';
// import { Quiz } from'@/features/quiz/types/quiz';
import { Material } from "@/types/material";

export interface Module {
    _id: string,
    title: string;
    subtitle: string;
    materials: Material[];
    // materials: (Lesson | Problem | Quiz)[];
}
