/**
 * Workshop Mode Configuration
 * Maps workshop delivery modes to their display properties
 */

export interface WorkshopModeConfig {
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  label: string;
  description: string;
}

export const WORKSHOP_MODES: Record<string, WorkshopModeConfig> = {
  online: {
    icon: '/workshop-modes/online.svg',
    color: '#0066CC',
    bgColor: '#E8F5FF',
    textColor: '#0066CC',
    label: 'Online',
    description: 'Live interactive sessions via video conference',
  },
  offline: {
    icon: '/workshop-modes/offline.svg',
    color: '#FF8C00',
    bgColor: '#FFF4E8',
    textColor: '#FF8C00',
    label: 'Offline',
    description: 'In-person sessions at our location',
  },
  residential: {
    icon: '/workshop-modes/residential.svg',
    color: '#22C55E',
    bgColor: '#E8F5E9',
    textColor: '#22C55E',
    label: 'Residential',
    description: 'Immersive experience with accommodation included',
  },
  recorded: {
    icon: '/workshop-modes/recorded.svg',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    textColor: '#9C27B0',
    label: 'Recorded',
    description: 'Self-paced video content access anytime',
  },
};

export const getModeConfig = (mode: string): WorkshopModeConfig => {
  return WORKSHOP_MODES[mode] || WORKSHOP_MODES.online;
};

export const getAllModes = () => Object.keys(WORKSHOP_MODES);
