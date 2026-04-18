import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { useMission } from "../context/MissionContext.tsx";
import {
  type MissionDraft,
  validateMissionDraft,
  type MissionDraftErrors,
} from "../lib/missionState.ts";

type DraftField = keyof MissionDraft;

const NUMBER_FIELDS: DraftField[] = [
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

export default function Setup() {
  const navigate = useNavigate();
  const {
    draft,
    patchRuntime,
    setDraft,
    selectedImageFile,
    setSelectedImageFile,
    selectedImageMeta,
    setSelectedImageMeta,
    selectedVideoFile,
    setSelectedVideoFile,
    selectedVideoMeta,
    setSelectedVideoMeta,
    analysisLoading,
  } = useMission();
  const [form, setForm] = useState<MissionDraft>(draft);
  const [errors, setErrors] = useState<MissionDraftErrors>({});
  const [imageError, setImageError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const validation = useMemo(() => validateMissionDraft(form), [form]);

  function updateField<K extends DraftField>(field: K, value: MissionDraft[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function applyImageFile(file: File | null) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      return;
    }

    setSelectedImageFile(file);
    setSelectedImageMeta({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    });
    setImageError("");
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    applyImageFile(event.target.files?.[0] ?? null);
  }

  function applyVideoFile(file: File | null) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      setVideoError("Please select a valid video file.");
      return;
    }

    setSelectedVideoFile(file);
    setSelectedVideoMeta({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    });
    setVideoError("");
  }

  function handleVideoInput(event: ChangeEvent<HTMLInputElement>) {
    applyVideoFile(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    applyImageFile(event.dataTransfer.files?.[0] ?? null);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!dragActive) {
      setDragActive(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }

  const imagePreviewUrl = useMemo(
    () => (selectedImageFile ? URL.createObjectURL(selectedImageFile) : ""),
    [selectedImageFile],
  );

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (!selectedImageFile) {
      setImageError("Select an image file before continuing.");
      return;
    }

    setDraft({
      ...form,
      image_path: selectedImageMeta?.name ?? form.image_path,
    });
    patchRuntime({
      analysisResult: null,
      plannedRoute: null,
      missionRecord: null,
      lastReplan: null,
      missionId: undefined,
      missionCreated: false,
    });
    setErrors({});
    setImageError("");
    setVideoError("");
    navigate("/analysis");
  }

  return (
    <section className="page page-setup">
      <div className="page-header">
        <div>
          <p className="eyebrow">Mission Input</p>
          <h1>Configure the demo mission package.</h1>
        </div>
        <p className="page-lead">
          These values persist in local storage and are reused by the analysis, planning, and live
          mission pages.
        </p>
      </div>

      <form className="glass-panel form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Drone ID</span>
            <input
              onChange={(event) => updateField("drone_id", event.target.value)}
              value={form.drone_id}
            />
            {errors.drone_id ? <small>{errors.drone_id}</small> : null}
          </label>

          <div className="field field-span-2">
            <span>Mission Image Upload</span>
            <div
              className="glass-panel"
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                borderStyle: "dashed",
                borderColor: dragActive ? "rgba(92, 225, 230, 0.75)" : "var(--line-strong)",
                cursor: "pointer",
                padding: "1rem",
              }}
            >
              <input
                accept="image/*"
                onChange={handleFileInput}
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                role="button"
                style={{ display: "grid", gap: "0.5rem" }}
                tabIndex={0}
              >
                <strong>{selectedImageMeta ? selectedImageMeta.name : "Drop image here or click to browse"}</strong>
                <span className="mission-muted">
                  {selectedImageMeta
                    ? `${selectedImageMeta.type || "unknown type"} · ${Math.max(
                        1,
                        Math.round(selectedImageMeta.size / 1024),
                      )} KB`
                    : "Supports JPG, PNG, WebP, and other browser-readable image formats."}
                </span>
              </div>
              {imagePreviewUrl ? (
                <img
                  alt="Selected mission"
                  src={imagePreviewUrl}
                  style={{
                    borderRadius: "0.9rem",
                    marginTop: "0.8rem",
                    maxHeight: "200px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              ) : null}
            </div>
            {!selectedImageFile && selectedImageMeta ? (
              <small>
                File metadata was restored, but the browser file handle is unavailable. Re-select the image before
                running analysis.
              </small>
            ) : null}
            {imageError ? <small>{imageError}</small> : null}
          </div>

          <div className="field field-span-2">
            <span>Mission Video Upload (Optional)</span>
            <div
              className="glass-panel"
              style={{
                borderStyle: "dashed",
                borderColor: "var(--line-strong)",
                cursor: "pointer",
                padding: "1rem",
              }}
            >
              <input
                accept="video/*"
                onChange={handleVideoInput}
                ref={videoInputRef}
                style={{ display: "none" }}
                type="file"
              />
              <div
                onClick={() => videoInputRef.current?.click()}
                role="button"
                style={{ display: "grid", gap: "0.5rem" }}
                tabIndex={0}
              >
                <strong>{selectedVideoMeta ? selectedVideoMeta.name : "Click to browse a video file"}</strong>
                <span className="mission-muted">
                  {selectedVideoMeta
                    ? `${selectedVideoMeta.type || "unknown type"} · ${Math.max(
                        1,
                        Math.round(selectedVideoMeta.size / 1024),
                      )} KB`
                    : "Supports MP4, MOV, AVI, and other browser-readable video formats."}
                </span>
              </div>
            </div>
            {!selectedVideoFile && selectedVideoMeta ? (
              <small>
                File metadata was restored, but the browser file handle is unavailable. Re-select the video if needed.
              </small>
            ) : null}
            {videoError ? <small>{videoError}</small> : null}
          </div>

          {NUMBER_FIELDS.map((field) => (
            <label className="field" key={field}>
              <span>{field.replaceAll("_", " ")}</span>
              <input
                onChange={(event) => updateField(field, Number(event.target.value))}
                type="number"
                value={(() => {
                  const value = form[field] as number;
                  return Number.isFinite(value) ? value : "";
                })()}
              />
              {errors[field] ? <small>{errors[field]}</small> : null}
            </label>
          ))}
        </div>

        <label className="toggle-field">
          <input
            checked={form.include_weather}
            onChange={(event) => updateField("include_weather", event.target.checked)}
            type="checkbox"
          />
          <span>Include weather analysis in the backend pipeline.</span>
        </label>

        {analysisLoading ? <div className="status-banner">Analysis is currently running...</div> : null}
        {errors.bounds ? <div className="error-banner">{errors.bounds}</div> : null}

        <div className="button-row">
          <Link className="button button-secondary" to="/auth">
            Previous
          </Link>
          <button className="button button-primary" type="submit">
            Save mission and continue
          </button>
        </div>
      </form>
    </section>
  );
}
