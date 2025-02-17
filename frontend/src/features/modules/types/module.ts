// Module.ts
import { Lesson } from '@/features/lesson/types/lesson';
import { Problem } from '@/features/problem/types/problem';
import { Quiz } from'@/features/quiz/types/quiz';

export interface Module {
    _id: string,
    title: string;
    subtitle?: string;
    materials: (Lesson | Problem | Quiz)[];
}
