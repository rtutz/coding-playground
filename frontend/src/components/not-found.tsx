import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-foreground mb-6">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
        <Button onClick={() => { navigate("/")}}>
            Go Home
        </Button>
    </div>
  );
};

export default NotFoundPage;
