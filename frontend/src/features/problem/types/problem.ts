import { Material } from '@/types/material';

interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Problem extends Material {
  type: 'problem';
  content: string;
  testCases?: TestCase[];
}