import { Material } from '@/types/material';

export interface Lesson extends Material {
  type: 'lesson';
  content: string;
}