import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './icon-strategy';
import { Button } from './button';

interface BackButtonProps {
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className={className}
    >
      <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
};