import React from 'react';
import { getModeConfig } from '../utils/workshopModes';

interface WorkshopModeBadgeProps {
  mode: 'online' | 'offline' | 'residential' | 'recorded';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDescription?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const WorkshopModeBadge: React.FC<WorkshopModeBadgeProps> = ({
  mode,
  size = 'md',
  showLabel = true,
  showDescription = false,
}) => {
  const config = getModeConfig(mode);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Icon Container */}
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`}
        style={{ backgroundColor: config.bgColor }}
      >
        <img
          src={config.icon}
          alt={config.label}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Label */}
      {showLabel && (
        <div className={`${textSizes[size]} font-semibold text-center`} style={{ color: config.color }}>
          {config.label}
        </div>
      )}

      {/* Description */}
      {showDescription && (
        <p className="text-xs text-gray-600 text-center max-w-xs">
          {config.description}
        </p>
      )}
    </div>
  );
};

export default WorkshopModeBadge;
