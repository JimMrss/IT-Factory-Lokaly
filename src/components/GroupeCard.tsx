import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Users } from 'lucide-react';

interface GroupeCardProps {
  groupe: {
    id: string;
    name: string;
    description: string;
    niveau: number;
    members: number;
    categorie?: string;
    image?: string;
  };
  onClick?: () => void;
}

export function GroupeCard({ groupe, onClick }: GroupeCardProps) {
  return (
    <Card hover onClick={onClick}>
      <div className="overflow-hidden">
        {/* Header */}
        <div className="h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-4 flex items-end">
          <Badge variant="level" level={groupe.niveau} />
        </div>

        {/* Contenu */}
        <div className="p-4 space-y-3">
          <h4 className="font-medium text-[var(--color-text-primary)] line-clamp-1">
            {groupe.name}
          </h4>

          <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2">
            {groupe.description}
          </p>

          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-border)]">
            <Users size={16} />
            <span className="text-sm">
              {groupe.members} membre{groupe.members > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
