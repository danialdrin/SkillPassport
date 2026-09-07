import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useSpaces } from "../context/SpaceContext";
import { resourcesApi } from "../api/resources";
import { PageShell } from "../components/layout/PageShell";
import { SpaceCard } from "../components/dashboard/SpaceCard";
import { SpaceModal } from "../components/dashboard/SpaceModal";
import { RecentResourceCard } from "../components/dashboard/RecentResourceCard";
import { UploadModal } from "../components/resources/UploadModal";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { ChevronRight, BookOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user_id || "";

  const {
    spaces,
    activeSpaceId,
    createSpace,
    editSpace,
    deleteSpace,
    setActiveSpaceId,
  } = useSpaces();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"pdf" | "url" | "text">("pdf");

  // Space Modal State
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);
  const [spaceModalMode, setSpaceModalMode] = useState<"create" | "edit">(
    "create",
  );
  const [editingSpaceId, setEditingSpaceId] = useState<string>("");
  const [editingSpaceName, setEditingSpaceName] = useState<string>("");

  // Resources Query
  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: () => resourcesApi.list(),
    enabled: !!userId,
  });

  // Strict Filter for Strong Analyzed Materials Only
  const strongAnalyzedResources = (resources || []).filter(
    (r) => r.status === "strong_analyzed",
  );

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.name ? user.name.split(" ")[0] : "Dani";

  const handleOpenCreateSpace = () => {
    setSpaceModalMode("create");
    setEditingSpaceName("");
    setSpaceModalOpen(true);
  };

  const handleOpenEditSpace = (id: string, currentName: string) => {
    setSpaceModalMode("edit");
    setEditingSpaceId(id);
    setEditingSpaceName(currentName);
    setSpaceModalOpen(true);
  };

  const handleSaveSpace = (name: string) => {
    if (spaceModalMode === "create") {
      createSpace(name);
    } else {
      editSpace(editingSpaceId, name);
    }
  };

  return (
    <PageShell className="space-y-8 py-6">
      {/* 1. Centered Hero Section */}
      <section className="text-center space-y-3 py-6 max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight">
          {getTimeGreeting()}, {userName}
        </h1>
        <p className="text-sm sm:text-base text-ink-muted font-medium">
          Ready to continue learning? Ingest custom materials or explore your
          spaces below.
        </p>
      </section>

      {/* 2. Spaces Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-ink tracking-tight">Spaces</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          <SpaceCard isNew onClick={handleOpenCreateSpace} />
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              title={space.name}
              countText={`${space.count} content`}
              isActive={space.id === activeSpaceId}
              onClick={() => setActiveSpaceId(space.id)}
              onEdit={() => handleOpenEditSpace(space.id, space.name)}
              onDelete={() => deleteSpace(space.id)}
            />
          ))}
        </div>
      </section>

      {/* 3. Recents Section: Only Shows Materials Which Passed Strong Analysis */}
      {(resourcesLoading || strongAnalyzedResources.length > 0) && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink tracking-tight">
              Recents
            </h3>

            {strongAnalyzedResources.length > 10 && (
              <Link
                to="/search"
                className="text-xs font-medium text-ink-muted hover:text-ink flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {resourcesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  key={i}
                  className="h-48 w-full bg-surface rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {strongAnalyzedResources.slice(0, 10).map((resource) => (
                <RecentResourceCard
                  key={resource.resource_id}
                  resource={resource}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Space Modal for Create and Edit */}
      <SpaceModal
        open={spaceModalOpen}
        onOpenChange={setSpaceModalOpen}
        mode={spaceModalMode}
        initialName={editingSpaceName}
        onSave={handleSaveSpace}
      />

      {/* Upload Intake Modal */}
      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        initialTab={modalTab}
      />
    </PageShell>
  );
};
