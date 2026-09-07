import React from 'react';
import { Youtube, FileText } from 'lucide-react';
import { getYouTubeVideoId } from '../../utils/youtube';

export interface VideoPlayerProps {
  sourceType: 'youtube' | 'pdf';
  urlOrFile: string;
  title: string;
  rawText?: string;
  onTimestampClick?: (seconds: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  sourceType,
  urlOrFile,
  title,
  rawText,
}) => {
  const isYoutube = sourceType === 'youtube';

  const getEmbedUrl = (url: string) => {
    const id = getYouTubeVideoId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
  };

  return (
    <div className="bg-surface border border-line rounded-sm overflow-hidden space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isYoutube ? <Youtube className="w-5 h-5 text-gap" /> : <FileText className="w-5 h-5 text-mastered" />}
          <h2 className="font-serif text-lg font-bold text-ink truncate max-w-xl">{title}</h2>
        </div>
        <span className="text-[11px] font-mono uppercase bg-paper border border-line px-2 py-0.5 rounded-xs text-ink-muted">
          {sourceType}
        </span>
      </div>

      {isYoutube ? (
        <div className="aspect-video w-full bg-ink rounded-xs overflow-hidden shadow-xs">
          <iframe
            src={getEmbedUrl(urlOrFile)}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="p-4 bg-paper border border-line rounded-xs max-h-96 overflow-y-auto space-y-2">
          <h3 className="font-mono text-xs uppercase text-ink-muted">Extracted PDF Content</h3>
          <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap font-sans">
            {rawText || 'PDF content extracted during ingestion.'}
          </p>
        </div>
      )}
    </div>
  );
};
