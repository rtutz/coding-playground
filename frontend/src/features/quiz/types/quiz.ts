import { Material } from '@/types/material';

export interface Option {
  content: string;
  isRight: boolean;
}

export interface Quiz extends Material {
  type: 'quiz';
  content: string;
  options: Option[];
}
