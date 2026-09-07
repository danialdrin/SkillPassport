import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchApi } from "../api/search";
import {
  CandidateResourceResponse,
  ResourceResponse,
  SearchResponse,
} from "../types/resources";
import { PageShell } from "../components/layout/PageShell";
import {
  SearchFilterChips,
  SearchFilterOption,
} from "../components/search/SearchFilterChips";
import {
  CandidateCard,
  AnalysisStatus,
} from "../components/search/CandidateCard";
import { CandidateCardSkeleton } from "../components/search/CandidateCardSkeleton";
import { SearchUnavailableBanner } from "../components/common/SearchUnavailableBanner";
import { UploadModal } from "../components/resources/UploadModal";
import { Button } from "../components/ui/button";
import { usePollJob } from "../hooks/usePollJob";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { PaginationControls } from "../components/search/PaginationControls";

const PAGE_SIZE = 15;

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const queryFromUrl = searchParams.get("query") || "";

  const [activeQuery, setActiveQuery] = useState(queryFromUrl);
  const [activeFilter, setActiveFilter] = useState<SearchFilterOption>("all");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [analysisStatuses, setAnalysisStatuses] = useState<
    Record<string, AnalysisStatus>
  >({});

  const queueCancellationRef = useRef<number>(0);

  // Poll active selection job
  const { data: jobData, error: jobError } = usePollJob(activeJobId);

  useEffect(() => {
    if (jobData?.status === "done" && jobData.result) {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      const resourceId = jobData.result.resource_id;
      setActiveJobId(null);
      navigate(`/resources/${resourceId}`);
    }
  }, [jobData, queryClient, navigate]);

  useEffect(() => {
    if (jobData?.status === "failed" || jobError) {
      setActiveJobId(null);
      setActiveResourceId(null);
    }
  }, [jobData, jobError]);

  // Execute Search query
  const {
    data: searchData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["search", activeQuery],
    queryFn: () => searchApi.search({ query: activeQuery }),
    enabled: !!activeQuery.trim(),
    staleTime: 1000 * 60 * 10, // 10 minutes cache freshness
  });

  const handleStopAnalysis = () => {
    if (activeJobId) {
      queryClient.cancelQueries({ queryKey: ["job", activeJobId] });
      queryClient.removeQueries({ queryKey: ["job", activeJobId] });
    }
    setActiveJobId(null);
    setActiveResourceId(null);
  };

  const handleMediumAnalyzed = (updatedResource: ResourceResponse) => {
    queryClient.setQueryData<SearchResponse>(
      ["search", activeQuery],
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          candidates: oldData.candidates.map((c) =>
            c.resource_id === updatedResource.resource_id
              ? { ...c, medium_analysis: updatedResource.medium_analysis }
              : c,
          ),
        };
      },
    );
  };

  // Reset page when active query or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeQuery, activeFilter]);

  // Client-side filtering over candidates
  const filteredCandidates = useMemo(() => {
    if (!searchData?.candidates) return [];
    return searchData.candidates.filter((c) => {
      if (activeFilter === "transcript") {
        return c.medium_analysis?.transcript_available === true;
      }
      if (activeFilter === "reviewed") {
        return !!c.medium_analysis;
      }
      if (activeFilter === "mock") {
        return c.is_mock === true;
      }
      return true;
    });
  }, [searchData, activeFilter]);

  // 15 videos per page pagination slicing
  const totalPages = Math.ceil(filteredCandidates.length / PAGE_SIZE) || 1;
  const pagedCandidates = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCandidates.slice(start, start + PAGE_SIZE);
  }, [filteredCandidates, currentPage]);

  // Automatic Sequential Medium Analysis Queue for Active Page
  useEffect(() => {
    if (!pagedCandidates || pagedCandidates.length === 0) return;

    const currentQueueId = ++queueCancellationRef.current;

    const runSequentialAnalysis = async () => {
      for (const candidate of pagedCandidates) {
        // Stop processing if active page or query changed
        if (queueCancellationRef.current !== currentQueueId) break;

        // Skip if already analyzed on server/cache
        if (candidate.medium_analysis) {
          setAnalysisStatuses((prev) =>
            prev[candidate.resource_id] === "complete"
              ? prev
              : { ...prev, [candidate.resource_id]: "complete" },
          );
          continue;
        }

        // Skip if already completed in local session state
        if (analysisStatuses[candidate.resource_id] === "complete") {
          continue;
        }

        // Mark current video as 'analyzing'
        setAnalysisStatuses((prev) => ({
          ...prev,
          [candidate.resource_id]: "analyzing",
        }));

        try {
          const res = await searchApi.analyzeMedium(candidate.resource_id);

          if (queueCancellationRef.current !== currentQueueId) break;

          handleMediumAnalyzed(res);
          setAnalysisStatuses((prev) => ({
            ...prev,
            [candidate.resource_id]: "complete",
          }));
        } catch (err) {
          console.error(
            `Medium analysis failed for video ${candidate.resource_id}`,
            err,
          );
          if (queueCancellationRef.current !== currentQueueId) break;
          setAnalysisStatuses((prev) => ({
            ...prev,
            [candidate.resource_id]: "failed",
          }));
        }
      }
    };

    runSequentialAnalysis();

    return () => {
      // Invalidate current queue on cleanup
      queueCancellationRef.current++;
    };
  }, [pagedCandidates, activeQuery]);

  const is503Error = (error as { status?: number })?.status === 503;

  // Sync query from URL search params
  useEffect(() => {
    setActiveQuery(queryFromUrl);
  }, [queryFromUrl]);

  return (
    <PageShell className="space-y-6 py-6">
      {/* Polling Job Indicator with Stop Action */}
      {activeJobId && (
        <div className="p-4 bg-surface border border-line rounded-xl flex items-center justify-between shadow-sm max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-ink animate-spin" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-ink">
                Strong Analysis Job Running
              </h4>
              <p className="text-xs text-ink-muted font-mono">
                STATUS: {jobData?.status?.toUpperCase() || "QUEUED"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStopAnalysis}
            className="text-xs border-gap text-gap hover:bg-gap/10 rounded-lg"
          >
            Stop Analysis
          </Button>
        </div>
      )}

      {/* 503 Error Banner */}
      {is503Error && (
        <SearchUnavailableBanner
          onOpenUpload={() => setUploadModalOpen(true)}
        />
      )}

      {/* Other Errors */}
      {isError && !is503Error && (
        <div className="p-4 bg-gap/10 border border-gap text-gap rounded-sm text-sm max-w-xl mx-auto">
          {(error as { detail?: string }).detail ||
            "Failed to fetch candidates."}
        </div>
      )}

      {/* Skeleton Loading State or Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 pt-4">
          {Array.from({ length: 15 }, (_, i) => (
            <CandidateCardSkeleton key={i} />
          ))}
        </div>
      ) : searchData ? (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <SearchFilterChips
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              count={filteredCandidates.length}
            />
          </div>

          {filteredCandidates.length > 0 ? (
            <>
              {/* 5 videos per row × 3 rows layout (15 items per page max) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {pagedCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.resource_id}
                    candidate={candidate}
                    activeJobId={activeJobId}
                    activeResourceId={activeResourceId}
                    onSelect={(jobId, resourceId) => {
                      setActiveJobId(jobId);
                      setActiveResourceId(resourceId);
                    }}
                    onMediumAnalyzed={(res) => handleMediumAnalyzed(res)}
                    analysisStatus={
                      analysisStatuses[candidate.resource_id] || "waiting"
                    }
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCandidates.length}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          ) : (
            <div className="p-12 bg-surface border border-line rounded-sm text-center space-y-3">
              <Sparkles className="w-8 h-8 text-ink-muted mx-auto" />
              <p className="text-sm font-medium text-ink">
                No candidates match the active filter
              </p>
              <p className="text-xs text-ink-muted">
                Try resetting your search filters or searching a broader
                concept.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveFilter("all")}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </section>
      ) : null}

      {/* Empty Initial State */}
      {!activeQuery && !isLoading && (
        <div className="p-12 bg-surface border border-line rounded-2xl text-center space-y-4 max-w-md mx-auto my-8">
          <div className="p-3 bg-paper border border-line rounded-full w-12 h-12 flex items-center justify-center mx-auto text-ink">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">
              Search Learning Material
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed mt-1">
              Enter a search topic above or ingest custom learning material
              directly.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
          >
            Upload Custom Material
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </PageShell>
  );
};
