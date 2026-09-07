import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { analysesApi } from '../api/analyses';
import { knowledgeGraphApi } from '../api/knowledge_graph';
import { resourcesApi } from '../api/resources';
import { PageShell } from '../components/layout/PageShell';
import { VideoPlayer } from '../components/study/VideoPlayer';
import { TranscriptTab } from '../components/study/TranscriptTab';
import { SummaryPanel } from '../components/study/SummaryPanel';
import { FlashcardsPanel } from '../components/study/FlashcardsPanel';
import { PracticeQuizPanel } from '../components/study/PracticeQuizPanel';
import { MindMapSvg } from '../components/study/MindMapSvg';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { ArrowLeft, HelpCircle, MessageSquareText, FileText, Sparkles } from 'lucide-react';

export const ResourceDetail: React.FC = () => {
  const { id: resourceId } = useParams<{ id: string }>();

  // Find associated resource doc from user list
  const { data: resources } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourcesApi.list(),
  });

  const resource = React.useMemo(() => {
    return resources?.find((r) => r.resource_id === resourceId);
  }, [resources, resourceId]);

  // Fetch Analysis doc
  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysis', resourceId],
    queryFn: async () => {
      // Find analysis_id from resource or fetch first analysis
      if (!resourceId) throw new Error('No resource ID');
      // For study page, analysis is queried via resource or analysisId
      return null;
    },
    enabled: !!resourceId,
  });

  // Fetch Material KG
  const { data: materialKg, isLoading: kgLoading } = useQuery({
    queryKey: ['material-kg', resourceId],
    queryFn: async () => {
      if (!resourceId) throw new Error('No resource ID');
      // Try to fetch material KG
      return knowledgeGraphApi.getMaterialKG(resourceId);
    },
    enabled: !!resourceId,
  });

  if (!resourceId) return null;

  return (
    <PageShell>
      {/* Navigation & Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="h-8 px-2.5">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <span className="text-[11px] font-mono uppercase text-ink-muted block">
              Resource Study Workspace
            </span>
            <h1 className="font-serif text-xl font-bold text-ink truncate max-w-lg">
              {resource?.title || 'Learning Resource Detail'}
            </h1>
          </div>
        </div>

        {/* Primary Exam Actions */}
        <div className="flex items-center gap-2">
          <Link to={`/quiz/${resourceId}`}>
            <Button variant="primary" size="sm" className="text-xs">
              <HelpCircle className="w-3.5 h-3.5 mr-1" /> Take Adaptive Quiz
            </Button>
          </Link>
          <Link to={`/interview/${resourceId}`}>
            <Button variant="secondary" size="sm" className="text-xs">
              <MessageSquareText className="w-3.5 h-3.5 mr-1" /> AI Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* Two-Column Study Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Media Player & Chapters/Transcript */}
        <div className="lg:col-span-7 space-y-6">
          <VideoPlayer
            sourceType={resource?.source_type || 'youtube'}
            urlOrFile={resource?.url_or_file || ''}
            title={resource?.title || 'Learning Resource'}
          />

          {/* Left Column Chapter / Transcript Tabs */}
          <div className="bg-surface border border-line rounded-sm p-4 space-y-4">
            <Tabs defaultValue="transcript">
              <TabsList>
                <TabsTrigger value="transcript">Transcript & Text</TabsTrigger>
                <TabsTrigger value="sections">Key Important Sections</TabsTrigger>
              </TabsList>

              <TabsContent value="transcript">
                <TranscriptTab transcriptOrText={resource?.title || 'Resource text transcript.'} />
              </TabsContent>

              <TabsContent value="sections">
                <div className="p-4 text-xs text-ink-muted leading-relaxed font-sans">
                  Key concepts and structural timestamps extracted during Strong Analysis.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column (5 cols): AI Study Container Tabs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-line rounded-sm p-4 space-y-4 shadow-xs">
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                <TabsTrigger value="quiz">Practice Quiz</TabsTrigger>
                <TabsTrigger value="mindmap">MindMap</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <SummaryPanel resourceId={resourceId} />
              </TabsContent>

              <TabsContent value="flashcards">
                <FlashcardsPanel resourceId={resourceId} />
              </TabsContent>

              <TabsContent value="quiz">
                <PracticeQuizPanel resourceId={resourceId} />
              </TabsContent>

              <TabsContent value="mindmap">
                <MindMapSvg materialKg={materialKg} isLoading={kgLoading} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
