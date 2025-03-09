import { useState, useEffect } from 'react';

type UserRole = 'student' | 'teacher'; // Add more roles as needed

export const useUserRole = (): UserRole => {
  const [role, setRole] = useState<UserRole>('student');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as UserRole;
    setRole(storedRole || 'student');
  }, []);

  return role;
};
