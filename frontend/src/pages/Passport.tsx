import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { passportApi } from '../api/passport';
import { PageShell } from '../components/layout/PageShell';
import { ScoreChip } from '../components/dashboard/ScoreChip';
import { PassportNodeTable } from '../components/passport/PassportNodeTable';
import { GapRecommendationCard } from '../components/passport/GapRecommendationCard';
import { InterviewHistoryList } from '../components/passport/InterviewHistoryList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Award, AlertTriangle, MessageSquareText, ShieldCheck, Calendar } from 'lucide-react';

export const PassportPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';

  // Passport Query
  const { data: passport, isLoading: passportLoading } = useQuery({
    queryKey: ['passport', userId],
    queryFn: () => passportApi.getPassport(userId),
    enabled: !!userId,
  });

  // Gaps Query
  const { data: gapsData, isLoading: gapsLoading } = useQuery({
    queryKey: ['passport-gaps', userId],
    queryFn: () => passportApi.getPassportGaps(userId),
    enabled: !!userId,
  });

  const overallScore = React.useMemo(() => {
    if (!passport || passport.nodes.length === 0) return 0;
    const total = passport.nodes.reduce((acc, node) => acc + node.competency_score, 0);
    return Math.round(total / passport.nodes.length);
  }, [passport]);

  return (
    <PageShell>
      {/* Header Banner */}
      <section className="mb-8 pb-6 border-b border-line">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-mastered" /> Verified Competency Artifact
            </span>
            <h1 className="font-serif text-3xl font-bold text-ink">
              Digital Skill Passport
            </h1>
            <p className="text-xs text-ink-muted leading-relaxed">
              Student ID: <span className="font-mono text-ink">{userId}</span> &bull; Verified skill competency backed by assessment evidence.
            </p>
          </div>

          <div className="bg-surface border border-line rounded-sm p-4 flex items-center gap-4 shrink-0 shadow-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Overall Score</span>
              <span className="text-xs text-ink font-semibold">Verified Average</span>
            </div>
            {passportLoading ? (
              <Skeleton className="h-8 w-24 bg-line/40" />
            ) : (
              <ScoreChip score={overallScore} size="lg" />
            )}
          </div>
        </div>
      </section>

      {/* Main Tabbed Container */}
      <div className="space-y-6">
        <Tabs defaultValue="nodes">
          <TabsList>
            <TabsTrigger value="nodes">
              <Award className="w-3.5 h-3.5 mr-1.5" />
              Verified Competency Nodes ({passport?.nodes?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="gaps">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              Prerequisite Gaps ({gapsData?.gaps?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="interviews">
              <MessageSquareText className="w-3.5 h-3.5 mr-1.5" />
              Interview Evaluation Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nodes">
            {passportLoading ? (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-10 w-full bg-surface" />
                <Skeleton className="h-48 w-full bg-surface" />
              </div>
            ) : (
              <PassportNodeTable nodes={passport?.nodes || []} />
            )}
          </TabsContent>

          <TabsContent value="gaps">
            {gapsLoading ? (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-20 w-full bg-surface" />
                <Skeleton className="h-20 w-full bg-surface" />
              </div>
            ) : (
              <GapRecommendationCard gaps={gapsData?.gaps || []} />
            )}
          </TabsContent>

          <TabsContent value="interviews">
            <InterviewHistoryList userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
};
