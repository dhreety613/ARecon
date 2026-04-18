import type {
  AnalysisResponse,
  MissionRecord,
  ReplanResponse,
  RouteResponse,
} from "./missionTypes.ts";

export type MissionDraft = {
  drone_id: string;
  image_path: string;
  latitude: number;
  longitude: number;
  start_row: number;
  start_col: number;
  goal_row: number;
  goal_col: number;
  north: number;
  south: number;
  east: number;
  west: number;
  include_weather: boolean;
};

export type UploadedImageMeta = {
  name: string;
  type: string;
  size: number;
  lastModified: number;
};

export type UploadedVideoMeta = {
  name: string;
  type: string;
  size: number;
  lastModified: number;
};

export type MissionRuntime = {
  analysisResult?: AnalysisResponse | null;
  plannedRoute?: RouteResponse | null;
  missionRecord?: MissionRecord | null;
  lastReplan?: ReplanResponse | null;
  uploadedImageMeta?: UploadedImageMeta | null;
  uploadedVideoMeta?: UploadedVideoMeta | null;
  missionId?: string;
  missionCreated?: boolean;
  auth?: {
    email?: string;
    username?: string;
    isAuthenticated?: boolean;
  };
};

export type MissionDraftErrors = Partial<Record<keyof MissionDraft | "bounds", string>>;

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const DRAFT_KEY = "drone-intel:mission-draft";
const RUNTIME_KEY = "drone-intel:mission-runtime";

const DEMO_MISSION: MissionDraft = {
  drone_id: "DRN-ALPHA-07",
  image_path: "C:/Users/armyt/Desktop/Drone/backend/test.jpg",
  latitude: 24.85,
  longitude: 92.78,
  start_row: 0,
  start_col: 0,
  goal_row: 19,
  goal_col: 19,
  north: 24.88,
  south: 24.82,
  east: 92.82,
  west: 92.74,
  include_weather: true,
};

function getStorage(storage?: StorageLike) {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function readJson<T>(key: string, fallback: T, storage?: StorageLike): T {
  const target = getStorage(storage);

  if (!target) {
    return fallback;
  }

  try {
    const raw = target.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T, storage?: StorageLike) {
  const target = getStorage(storage);
  if (!target) {
    return;
  }

  target.setItem(key, JSON.stringify(value));
}

export function defaultMissionDraft(): MissionDraft {
  return { ...DEMO_MISSION };
}

export function loadMissionDraft(storage?: StorageLike): MissionDraft {
  return readJson(DRAFT_KEY, defaultMissionDraft(), storage);
}

export function saveMissionDraft(draft: MissionDraft, storage?: StorageLike) {
  writeJson(DRAFT_KEY, draft, storage);
}

export function hasStoredMissionDraft(storage?: StorageLike) {
  const target = getStorage(storage);
  return target ? target.getItem(DRAFT_KEY) !== null : false;
}

export function loadMissionRuntime(storage?: StorageLike): MissionRuntime {
  return readJson(RUNTIME_KEY, {}, storage);
}

export function saveMissionRuntime(runtime: MissionRuntime, storage?: StorageLike) {
  writeJson(RUNTIME_KEY, runtime, storage);
}

export function validateMissionDraft(draft: MissionDraft) {
  const errors: MissionDraftErrors = {};

  const requiredTextFields: (keyof Pick<MissionDraft, "drone_id">)[] = ["drone_id"];

  for (const field of requiredTextFields) {
    if (!String(draft[field]).trim()) {
      errors[field] = "This field is required.";
    }
  }

  const numericFields: (keyof Pick<
    MissionDraft,
    | "latitude"
    | "longitude"
    | "start_row"
    | "start_col"
    | "goal_row"
    | "goal_col"
    | "north"
    | "south"
    | "east"
    | "west"
  >)[] = [
    "latitude",
    "longitude",
    "start_row",
    "start_col",
    "goal_row",
    "goal_col",
    "north",
    "south",
    "east",
    "west",
  ];

  for (const field of numericFields) {
    if (!Number.isFinite(draft[field])) {
      errors[field] = "Enter a valid number.";
    }
  }

  if (
    Number.isFinite(draft.north) &&
    Number.isFinite(draft.south) &&
    draft.north <= draft.south
  ) {
    errors.bounds = "North must be greater than south.";
  }

  if (
    Number.isFinite(draft.east) &&
    Number.isFinite(draft.west) &&
    draft.east <= draft.west
  ) {
    errors.bounds = "East must be greater than west.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
