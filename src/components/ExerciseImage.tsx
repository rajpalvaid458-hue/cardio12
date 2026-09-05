import React from 'react';
import { Exercise, WorkoutExerciseItem } from '../types';
import { Dumbbell, Flame, Waves, Heart, Shield, Music, Zap } from 'lucide-react';

interface ExerciseImageProps {
  exercise?: Partial<Exercise> | Partial<WorkoutExerciseItem> | {
    id?: string;
    name?: string;
    category?: string;
    equipment?: string;
    targetMuscle?: string;
    imageUrl?: string;
  };
  name?: string;
  category?: string;
  equipment?: string;
  imageUrl?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero' | 'thumbnail';
  alt?: string;
  showBadge?: boolean;
  showEquipmentPill?: boolean;
  showZoomOnHover?: boolean;
  forceImage?: boolean;
  onClick?: () => void;
}

export const ExerciseImage: React.FC<ExerciseImageProps> = ({
  exercise,
  name: nameProp,
  category: categoryProp,
  containerClassName = '',
  aspectRatio = 'auto',
  onClick,
}) => {
  const name = nameProp || exercise?.name || '';
  const category = categoryProp || exercise?.category || '';

  const getCategoryIcon = () => {
    const c = (category || '').toLowerCase();
    if (c.includes('swim')) return Waves;
    if (c.includes('zumba') || c.includes('dance')) return Music;
    if (c.includes('yoga') || c.includes('stretch') || c.includes('mobility')) return Heart;
    if (c.includes('cardio') || c.includes('hiit')) return Flame;
    if (c.includes('box') || c.includes('combat')) return Shield;
    if (c.includes('calisthenic')) return Zap;
    return Dumbbell;
  };

  const CategoryIcon = getCategoryIcon();

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'square':
        return 'aspect-square';
      case 'wide':
        return 'aspect-[16/9]';
      case 'auto':
      default:
        return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center select-none ${getAspectClass()} ${
        onClick ? 'cursor-pointer hover:border-emerald-500/50 transition-colors' : ''
      } ${containerClassName}`}
    >
      <div className="flex flex-col items-center justify-center p-2 text-center text-emerald-400">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CategoryIcon className="w-4 h-4" />
        </div>
        {name && (
          <span className="text-[10px] font-bold text-slate-300 truncate max-w-[95%] mt-1 px-1">
            {name}
          </span>
        )}
      </div>
    </div>
  );
};


