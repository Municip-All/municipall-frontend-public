import React from 'react';
import './Badge.scss';

type BadgeVariant = 'en-cours' | 'attente' | 'resolu' | 'rejete' | 'perturbe' | 'planifie' | 'normal' | 'info' | 'urgent' | 'ouvert' | 'ferme';

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANT_LABELS: Record<BadgeVariant, string> = {
  'en-cours': 'En cours',
  'attente': 'En attente',
  'resolu': 'Résolu',
  'rejete': 'Rejeté',
  'perturbe': 'Perturbé',
  'planifie': 'Planifié',
  'normal': 'Normal',
  'info': 'Info',
  'urgent': 'Urgent',
  'ouvert': 'Ouvert',
  'ferme': 'Fermé',
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '', style }) => {
  return (
    <span className={`badge badge--${variant} ${className}`} style={style}>
      {children ?? VARIANT_LABELS[variant]}
    </span>
  );
};

export const statusToBadgeVariant = (statut: string): BadgeVariant => {
  if (statut === 'en-cours') return 'en-cours';
  if (statut === 'attente') return 'attente';
  if (statut === 'resolu') return 'resolu';
  if (statut === 'rejete') return 'rejete';
  if (statut === 'perturbe') return 'perturbe';
  if (statut === 'planifie') return 'planifie';
  if (statut === 'normal') return 'normal';
  return 'info';
};
