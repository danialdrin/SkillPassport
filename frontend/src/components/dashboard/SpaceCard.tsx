import React, { useState, useEffect, useRef } from 'react';
import { Plus, MoreVertical, Edit3, Trash2 } from 'lucide-react';

interface SpaceCardProps {
  isNew?: boolean;
  title?: string;
  countText?: string;
  isActive?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  isNew = false,
  title = 'Untitled Space',
  countText = '1 content',
  isActive = false,
  onClick,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  if (isNew) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col items-center justify-center h-36 sm:h-40 w-52 sm:w-64 rounded-2xl border-2 border-dashed border-line/70 bg-surface/40 hover:bg-surface hover:border-line transition-all p-5 group shrink-0 text-center cursor-pointer"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200/80 text-stone-600 group-hover:scale-105 transition-transform mb-2.5">
          <Plus className="h-6 w-6" />
        </div>
        <span className="text-sm font-semibold text-ink-muted group-hover:text-ink">New Space</span>
      </button>
    );
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.();
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between h-36 sm:h-40 w-56 sm:w-64 rounded-2xl border transition-all cursor-pointer overflow-hidden shrink-0 group ${
        isActive
          ? 'border-stone-800 ring-2 ring-stone-800/10 bg-surface shadow-sm'
          : 'border-line bg-surface/80 hover:bg-surface hover:shadow-md'
      }`}
    >
      <div className={`h-16 sm:h-20 w-full relative ${isActive ? 'bg-stone-300/80' : 'bg-stone-200/70'}`}>
        {/* Three-Dot Menu Button */}
        <div ref={menuRef} className="absolute right-2 top-2 z-20">
          <button
            type="button"
            onClick={handleMenuClick}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/80 hover:bg-surface text-ink-muted hover:text-ink transition-colors shadow-xs"
            aria-label="Space options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-line bg-surface p-1 shadow-md text-xs space-y-0.5">
              <button
                type="button"
                onClick={handleEdit}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium text-ink hover:bg-paper transition-colors text-left"
              >
                <Edit3 className="h-3.5 w-3.5 text-stone-600" />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium text-gap hover:bg-gap/10 transition-colors text-left"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-2">
        <h4 className={`text-sm sm:text-base font-bold truncate ${isActive ? 'text-stone-900' : 'text-ink group-hover:text-stone-900'}`}>
          {title}
        </h4>
        <p className="text-xs text-ink-muted mt-0.5">{countText}</p>
      </div>
    </div>
  );
};
