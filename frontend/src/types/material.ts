export interface Material {
    _id: string;
    type: 'lesson' | 'problem' | 'quiz';
    title: string;
    content: string;
}