import React from 'react';
import { AlertTriangle, Upload, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export interface SearchUnavailableBannerProps {
  onOpenUpload: () => void;
}

export const SearchUnavailableBanner: React.FC<SearchUnavailableBannerProps> = ({ onOpenUpload }) => {
  return (
    <div className="p-5 bg-developing/10 border border-developing text-ink rounded-sm space-y-3 my-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-developing shrink-0 mt-0.5" />
        <div>
          <h4 className="font-serif font-semibold text-sm text-ink">YouTube Search Currently Unavailable (503)</h4>
          <p className="text-xs text-ink-muted leading-relaxed mt-0.5">
            Live YouTube search is temporarily unavailable (API quota limit or missing service credentials). You can still ingest material directly by uploading a PDF document or pasting a direct video URL.
          </p>
        </div>
      </div>
      <div className="flex justify-end pt-1">
        <Button variant="secondary" size="sm" onClick={onOpenUpload} className="text-xs">
          <Upload className="w-3.5 h-3.5 mr-1" />
          Upload PDF or Paste Direct URL
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
