import { Material } from '@/types/material';

interface Option {
  content: string;
  isRight: boolean;
}

export interface Quiz extends Material {
  type: 'quiz';
  options: Option[];
}
