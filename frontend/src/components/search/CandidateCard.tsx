import React from "react";
import {
  CandidateResourceResponse,
  ResourceResponse,
} from "../../types/resources";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { resourcesApi } from "../../api/resources";

export type AnalysisStatus = "waiting" | "analyzing" | "complete" | "failed";

export interface CandidateCardProps {
  candidate: CandidateResourceResponse;
  onSelect: (jobId: string, resourceId: string) => void;
  onMediumAnalyzed?: (updatedResource: ResourceResponse) => void;
  activeJobId?: string | null;
  activeResourceId?: string | null;
  analysisStatus?: AnalysisStatus;
  mockMode?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  activeJobId,
  activeResourceId,
  analysisStatus = "waiting",
  mockMode = false,
}) => {
  const [selecting, setSelecting] = React.useState(false);
  const isJobActiveForThisCard = activeResourceId === candidate.resource_id;

  const medium = candidate.medium_analysis;
  const currentStatus: AnalysisStatus = isJobActiveForThisCard
    ? "analyzing"
    : medium
      ? "complete"
      : analysisStatus;

  const handleSelect = async () => {
    setSelecting(true);
    try {
      if (mockMode) {
        onSelect(`mock-job-${candidate.resource_id}`, candidate.resource_id);
        return;
      }
      const response = await resourcesApi.select(candidate.resource_id);
      onSelect(response.job_id, candidate.resource_id);
    } catch (err) {
      console.error("Selection failed", err);
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div
      className={`group bg-surface border rounded-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-sm ${
        currentStatus === "analyzing"
          ? "border-ink/50 ring-1 ring-ink/20"
          : "border-line hover:border-ink"
      }`}
    >
      <div>
        {/* 16:9 Thumbnail Header */}
        <div className="relative aspect-video w-full bg-ink/10 overflow-hidden">
          <img
            src={candidate.thumbnail}
            alt={candidate.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
            }}
          />

          {candidate.is_mock && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-ink/80 text-paper text-[10px]"
            >
              DEV MOCK
            </Badge>
          )}

          {medium && (
            <div className="absolute bottom-2 right-2 bg-ink/90 text-paper font-mono text-xs px-2 py-0.5 rounded-xs border border-paper/20 shadow-xs">
              Score: {Math.round(medium.overall)}/100
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-3.5 space-y-2">
          <h3 className="font-sans font-semibold text-xs text-ink line-clamp-2 leading-snug group-hover:text-ink">
            {candidate.title}
          </h3>

          <p className="text-[11px] font-mono text-ink-muted truncate">
            {candidate.channel}
          </p>

          {/* Medium Analysis State Indicator Area */}
          <div className="mt-2 pt-2 border-t border-line">
            {currentStatus === "complete" && medium && (
              <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] bg-paper p-1.5 rounded-xs border border-line/60">
                <div>
                  <span className="text-ink-muted block text-[9px]">
                    Relevance
                  </span>
                  <span className="font-semibold text-ink">
                    {Math.round(medium.relevance)}%
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[9px]">
                    Clarity
                  </span>
                  <span className="font-semibold text-ink">
                    {Math.round(medium.clarity)}%
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[9px]">Depth</span>
                  <span className="font-semibold text-ink">
                    {Math.round(medium.depth)}%
                  </span>
                </div>
              </div>
            )}

            {currentStatus === "analyzing" && (
              <div className="bg-paper p-2 rounded-xs border border-ink/30 flex items-center justify-center gap-2 text-xs font-mono text-ink animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-ink" />
                <span>Analyzing...</span>
              </div>
            )}

            {currentStatus === "waiting" && (
              <div className="bg-paper/50 p-1.5 rounded-xs border border-line/40 flex items-center justify-center gap-1.5 text-[11px] font-mono text-ink-muted">
                <Clock className="w-3 h-3" />
                <span>Waiting for analysis</span>
              </div>
            )}

            {currentStatus === "failed" && (
              <div className="bg-gap/10 p-1.5 rounded-xs border border-gap/30 flex items-center justify-center gap-1.5 text-[11px] font-mono text-gap">
                <AlertCircle className="w-3 h-3" />
                <span>Analysis Failed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3.5 pt-0 space-y-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="w-full text-xs h-8"
          onClick={handleSelect}
          disabled={selecting || isJobActiveForThisCard}
        >
          {selecting || isJobActiveForThisCard ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
          ) : null}
          {selecting
            ? "Initiating Job..."
            : isJobActiveForThisCard
              ? "Analyzing Video..."
              : "Select & Start Strong Analysis"}
          {!selecting && !isJobActiveForThisCard && (
            <ArrowRight className="w-3 h-3 ml-1" />
          )}
        </Button>
      </div>
    </div>
  );
};
