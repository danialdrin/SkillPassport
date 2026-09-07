import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "../api/jobs";
import { JobResponse } from "../types/resources";

export function usePollJob(jobId: string | null) {
  return useQuery<JobResponse, Error>({
    queryKey: ["job", jobId],
    queryFn: () => {
      if (!jobId) throw new Error("No job ID provided");
      return jobsApi.getJobStatus(jobId);
    },
    enabled: !!jobId,
    retry: false,
    refetchInterval: (query) => {
      if (query.state.error) return false;
      const data = query.state.data;
      if (!data) return 2000;
      if (data.status === "queued" || data.status === "processing") {
        return 2000;
      }
      return false; // Stop polling on done or failed
    },
    refetchIntervalInBackground: true,
  });
}
