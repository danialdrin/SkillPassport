import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert } from "../ui/alert";
import { resourcesApi } from "../../api/resources";
import { usePollJob } from "../../hooks/usePollJob";
import { FileUp, Link2, Loader2, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "pdf" | "url" | "text";
}

export const UploadModal: React.FC<UploadModalProps> = ({
  open,
  onOpenChange,
  initialTab = "pdf",
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<"pdf" | "url" | "text">(initialTab);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Sync tab when modal opens or initialTab changes
  React.useEffect(() => {
    if (open && initialTab) {
      setTab(initialTab);
      setError(null);
    }
  }, [open, initialTab]);

  // Background job polling
  const { data: jobData, error: jobError } = usePollJob(activeJobId);

  // Monitor job polling status
  React.useEffect(() => {
    if (jobData?.status === "done" && jobData.result) {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      const resourceId = jobData.result.resource_id;
      setActiveJobId(null);
      onOpenChange(false);
      navigate(`/resources/${resourceId}`);
    }
  }, [jobData, queryClient, navigate, onOpenChange]);

  React.useEffect(() => {
    if (jobData?.status === "failed" || jobError) {
      setError(
        jobData?.error ||
          jobError?.message ||
          "Strong Analysis failed. Please retry.",
      );
      setActiveJobId(null);
      setUploading(false);
    }
  }, [jobData, jobError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith(".pdf")) {
        setError("Only PDF documents (.pdf) are supported.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    if (tab === "pdf") {
      if (!file) {
        setError("Please select a valid PDF file.");
        return;
      }
      formData.append("file", file);
    } else if (tab === "url") {
      if (
        !url.trim() ||
        (!url.includes("youtube.com") && !url.includes("youtu.be"))
      ) {
        setError("Please enter a valid YouTube video URL.");
        return;
      }
      formData.append("url", url.trim());
    } else {
      if (!pastedText.trim()) {
        setError("Please paste your text or paragraphs.");
        return;
      }
      const textBlob = new Blob([pastedText], { type: "text/plain" });
      const textFile = new File([textBlob], "pasted_notes.txt", {
        type: "text/plain",
      });
      formData.append("file", textFile);
    }

    setUploading(true);
    try {
      const res = await resourcesApi.upload(formData);
      setActiveJobId(res.job_id);
    } catch (err: unknown) {
      const apiErr = err as { detail?: string };
      setError(apiErr.detail || "Upload failed. Please check your input.");
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className="text-center space-y-1.5">
        <DialogTitle className="text-center font-serif text-xl font-bold text-ink">
          Ingest Learning Material
        </DialogTitle>
        <DialogDescription className="text-center text-xs text-ink-muted leading-relaxed max-w-sm mx-auto">
          Upload a PDF document, paste a YouTube link, or paste raw text to
          analyze learning material.
        </DialogDescription>
      </DialogHeader>

      {/* Centered Mode Selection Tabs */}
      <div className="flex border-b border-line mb-4 justify-center">
        <button
          type="button"
          onClick={() => {
            setTab("pdf");
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer text-center ${
            tab === "pdf"
              ? "border-ink text-ink"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <FileText className="w-4 h-4" /> PDF
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("url");
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer text-center ${
            tab === "url"
              ? "border-ink text-ink"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <Link2 className="w-4 h-4" /> YouTube Link
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("text");
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer text-center ${
            tab === "text"
              ? "border-ink text-ink"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <FileUp className="w-4 h-4" /> Paste Text
        </button>
      </div>

      {error && (
        <Alert variant="error" className="mb-4 text-center">
          <span>{error}</span>
        </Alert>
      )}

      {/* Polling active state */}
      {activeJobId ? (
        <div className="py-8 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-ink animate-spin mx-auto" />
          <div className="text-center">
            <h4 className="font-serif font-semibold text-sm text-ink">
              Analyzing Material
            </h4>
            <p className="text-xs text-ink-muted font-mono mt-1">
              STATUS: {jobData?.status?.toUpperCase() || "QUEUED"}
            </p>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed max-w-xs mx-auto text-center">
            Extracting topics, concept definitions, Bloom taxonomy levels, and
            knowledge relationships...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "pdf" ? (
            <div className="border-2 border-dashed border-line rounded-sm p-6 text-center hover:border-ink transition-colors bg-paper/50 flex flex-col items-center justify-center">
              <FileUp className="w-8 h-8 text-ink-muted mx-auto mb-2" />
              <label className="block text-xs font-medium text-ink cursor-pointer mb-1 text-center">
                {file ? file.name : "Click to browse or drop PDF document"}
              </label>
              <span className="text-[10px] text-ink-muted block font-mono text-center">
                Maximum file size: 25MB
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload-input"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 text-xs mx-auto"
                onClick={() =>
                  document.getElementById("pdf-upload-input")?.click()
                }
                disabled={uploading}
              >
                {file ? "Change File" : "Select PDF"}
              </Button>
            </div>
          ) : tab === "url" ? (
            <div className="space-y-2 text-center">
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider text-center">
                YouTube Video Link
              </label>
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={uploading}
                className="text-center placeholder:text-center"
              />
              <span className="text-[11px] text-ink-muted block text-center">
                Direct URL ingestion proceeds straight to Strong Analysis.
              </span>
            </div>
          ) : (
            <div className="space-y-2 text-center">
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider text-center">
                Paste Text / Notes / Paragraphs
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste long text, article paragraphs, or study notes here..."
                rows={5}
                className="w-full rounded-sm border border-line bg-surface p-3 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink text-center placeholder:text-center"
                disabled={uploading}
                required
              />
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
              className="w-28 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="w-36 text-xs"
              disabled={
                uploading ||
                (tab === "pdf" && !file) ||
                (tab === "url" && !url.trim()) ||
                (tab === "text" && !pastedText.trim())
              }
            >
              {uploading ? "Ingesting..." : "Start Strong Analysis"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
};
