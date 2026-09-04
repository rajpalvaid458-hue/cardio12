import React, { useState } from 'react';
import { Exercise, WorkoutExerciseItem } from '../types';
import { Dumbbell, Flame, Waves, Heart, Shield, Music, Zap } from 'lucide-react';
import { getExerciseImageUrl, isChestExercise } from '../utils/exerciseImages';

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
  imageUrl: imageUrlProp,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  aspectRatio = 'auto',
  showZoomOnHover = false,
  forceImage = false,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const name = nameProp || exercise?.name || '';
  const category = categoryProp || exercise?.category || '';
  const id = exercise?.id || '';

  const isChest =
    forceImage ||
    isChestExercise(exercise) ||
    category.toLowerCase() === 'chest' ||
    (exercise?.targetMuscle && exercise.targetMuscle.toLowerCase().includes('chest'));

  const imageUrl = isChest
    ? imageUrlProp ||
      (exercise as any)?.imageUrl ||
      getExerciseImageUrl({
        id,
        name,
        category,
        imageUrl: imageUrlProp || (exercise as any)?.imageUrl,
      })
    : undefined;

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

  // If this is a chest exercise and we have an image that hasn't errored:
  if (isChest && imageUrl && !imageError) {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden bg-slate-900 select-none ${getAspectClass()} ${
          onClick ? 'cursor-pointer' : ''
        } ${containerClassName}`}
      >
        <img
          src={imageUrl}
          alt={name || 'Chest workout'}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className={`${className} ${
            showZoomOnHover ? 'group-hover:scale-110 transition-transform duration-300' : ''
          }`}
          loading="lazy"
        />
      </div>
    );
  }

  // Non-chest exercises or image error fallback to clean category icon
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-emerald-50 text-emerald-700 flex items-center justify-center select-none ${getAspectClass()} ${
        onClick ? 'cursor-pointer' : ''
      } ${containerClassName}`}
    >
      <CategoryIcon className="w-5 h-5 text-emerald-600" />
    </div>
  );
};

