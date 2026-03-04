import React, { useState, useEffect } from 'react';
import { TranscriptionJob, Segment } from '../../types';
import { getJobStatus } from '../../api';
import SidebarInfo from './SidebarInfo';
import ProgressSection from './ProgressSection';
import TimelineSection from './TimelineSection';
import LivePreview from './LivePreview';

interface TranscribingProps {
  job: TranscriptionJob;
  onComplete: (segments: Segment[]) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export default function Transcribing({ job, onComplete, onCancel, t }: TranscribingProps) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [liveSegments, setLiveSegments] = useState<Segment[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!job.id) {
      console.error("Transcribing: job.id is missing");
      return;
    }

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const data = await getJobStatus(job.id!);
        if (!isMounted) return;

        const currentProgress = (data.progress || 0) * 100;
        setProgress(currentProgress);

        if (data.segments && data.segments.length > 0) {
          setLiveSegments(data.segments);
        }

        if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }

        if (data.status === 'completed') {
          clearInterval(interval);
          // Passiamo i segmenti finali (che potrebbero essere più di quelli live)
          setTimeout(() => {
            if (isMounted) onComplete(data.segments || liveSegments);
          }, 1500);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError(data.error || t('transcribing.unknownError'));
        }
      } catch (e) {
        console.warn("Polling error:", e);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [job.id, onComplete, t, liveSegments]);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#141414]">
      <SidebarInfo job={job} t={t} />

      <div className="flex-1 flex flex-col bg-[#141414] p-8 overflow-y-auto">
        <ProgressSection
          progress={progress}
          error={error}
          onCancel={onCancel}
          onGoToEditor={() => onComplete(liveSegments)}
          t={t}
        />

        <TimelineSection progress={progress} isError={error !== null} t={t} logs={logs} />

        <LivePreview
          segments={liveSegments}
          progress={progress}
          t={t}
        />
      </div>
    </div>
  );
}
