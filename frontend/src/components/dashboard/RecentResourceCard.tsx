import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResourceResponse } from '../../types/resources';
import { FileText, Youtube } from 'lucide-react';

interface RecentResourceCardProps {
  resource: ResourceResponse;
}

export const RecentResourceCard: React.FC<RecentResourceCardProps> = ({ resource }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    navigate(`/resources/${resource.resource_id}`);
  };

  const isVideo = resource.source_type === 'youtube' || (resource.url_or_file && resource.url_or_file.includes('youtube'));

  // Extract YouTube video thumbnail URL if resource.thumbnail is not directly present
  const getThumbnailUrl = () => {
    if (resource.thumbnail) return resource.thumbnail;
    if (isVideo && resource.url_or_file) {
      if (resource.url_or_file.includes('v=')) {
        const videoId = resource.url_or_file.split('v=')[1]?.split('&')[0];
        if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } else if (resource.url_or_file.includes('youtu.be/')) {
        const videoId = resource.url_or_file.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    return null;
  };

  const thumbnailUrl = getThumbnailUrl();

  // Format relative timestamp
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col justify-between rounded-2xl border border-line bg-surface hover:border-ink/30 hover:shadow-md transition-all cursor-pointer overflow-hidden group"
    >
      {/* Top Media Thumbnail Container */}
      <div className="h-32 w-full bg-stone-200/60 relative flex items-center justify-center overflow-hidden group-hover:bg-stone-200/80 transition-colors">
        {thumbnailUrl && !imgError ? (
          <img
            src={thumbnailUrl}
            alt={resource.title || 'Video thumbnail'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : isVideo ? (
          <Youtube className="w-8 h-8 text-stone-400 group-hover:text-stone-600 transition-colors" />
        ) : (
          <FileText className="w-8 h-8 text-stone-400 group-hover:text-stone-600 transition-colors" />
        )}

        {/* Status Badge */}
        <div className="absolute right-2.5 bottom-2.5 h-6 px-2 rounded-full border border-stone-300 bg-surface/90 flex items-center justify-center shadow-xs">
          <span className="text-[9px] font-mono font-medium text-stone-700">Analyzed</span>
        </div>
      </div>

      {/* Bottom Info Container */}
      <div className="p-3.5 space-y-1">
        <h4 className="text-xs font-semibold text-ink line-clamp-2 leading-snug group-hover:text-stone-900">
          {resource.title || 'Untitled Resource'}
        </h4>
        <p className="text-[10px] text-ink-muted font-mono">
          {getRelativeTime(resource.created_at)}
        </p>
      </div>
    </div>
  );
};
