/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  defaultMissionDraft,
  hasStoredMissionDraft,
  loadMissionDraft,
  loadMissionRuntime,
  saveMissionDraft,
  saveMissionRuntime,
  type MissionDraft,
  type MissionRuntime,
  type UploadedImageMeta,
  type UploadedVideoMeta,
} from "../lib/missionState.ts";

type MissionContextValue = {
  draft: MissionDraft;
  runtime: MissionRuntime;
  hasDraft: boolean;
  hasRoute: boolean;
  hasMissionId: boolean;
  selectedImageFile: File | null;
  setSelectedImageFile: (file: File | null) => void;
  selectedImageMeta: UploadedImageMeta | null;
  setSelectedImageMeta: (meta: UploadedImageMeta | null) => void;
  selectedVideoFile: File | null;
  setSelectedVideoFile: (file: File | null) => void;
  selectedVideoMeta: UploadedVideoMeta | null;
  setSelectedVideoMeta: (meta: UploadedVideoMeta | null) => void;
  analysisLoading: boolean;
  setAnalysisLoading: (loading: boolean) => void;
  setDraft: (draft: MissionDraft) => void;
  patchRuntime: (patch: Partial<MissionRuntime>) => void;
  resetMission: () => void;
};

const MissionContext = createContext<MissionContextValue | null>(null);

export function MissionProvider({ children }: PropsWithChildren) {
  const [draft, setDraftState] = useState<MissionDraft>(() => loadMissionDraft());
  const [runtime, setRuntimeState] = useState<MissionRuntime>(() => loadMissionRuntime());
  const [draftSaved, setDraftSaved] = useState(() => hasStoredMissionDraft());
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageMeta, setSelectedImageMetaState] = useState<UploadedImageMeta | null>(
    () => runtime.uploadedImageMeta ?? null,
  );
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedVideoMeta, setSelectedVideoMetaState] = useState<UploadedVideoMeta | null>(
    () => runtime.uploadedVideoMeta ?? null,
  );

  useEffect(() => {
    saveMissionDraft(draft);
  }, [draft]);

  useEffect(() => {
    saveMissionRuntime(runtime);
  }, [runtime]);

  const value = useMemo<MissionContextValue>(
    () => ({
      draft,
      runtime,
      hasDraft: draftSaved,
      hasRoute: Boolean(runtime.plannedRoute?.geo_path?.length),
      hasMissionId: Boolean(runtime.missionId),
      selectedImageFile,
      setSelectedImageFile,
      selectedImageMeta,
      setSelectedImageMeta: (meta) => {
        setSelectedImageMetaState(meta);
        setRuntimeState((current) => ({ ...current, uploadedImageMeta: meta }));
      },
      selectedVideoFile,
      setSelectedVideoFile,
      selectedVideoMeta,
      setSelectedVideoMeta: (meta) => {
        setSelectedVideoMetaState(meta);
        setRuntimeState((current) => ({ ...current, uploadedVideoMeta: meta }));
      },
      analysisLoading,
      setAnalysisLoading,
      setDraft: (nextDraft) => {
        setDraftState(nextDraft);
        setDraftSaved(true);
      },
      patchRuntime: (patch) => setRuntimeState((current) => ({ ...current, ...patch })),
      resetMission: () => {
        const nextDraft = defaultMissionDraft();
        setDraftState(nextDraft);
        setRuntimeState({});
        setSelectedImageFile(null);
        setSelectedImageMetaState(null);
        setSelectedVideoFile(null);
        setSelectedVideoMetaState(null);
        setAnalysisLoading(false);
        setDraftSaved(false);
      },
    }),
    [
      analysisLoading,
      draft,
      draftSaved,
      runtime,
      selectedImageFile,
      selectedImageMeta,
      selectedVideoFile,
      selectedVideoMeta,
    ],
  );

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
}

export function useMission() {
  const context = useContext(MissionContext);

  if (!context) {
    throw new Error("useMission must be used inside MissionProvider.");
  }

  return context;
}
