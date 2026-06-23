"use client";

import AdminAudioField from "@/components/admin/AdminAudioField";
import { LESSON_PART_TYPES } from "@/lib/lessons/constants";

export type PartFieldsValue = {
  type: string;
  title: string;
  duration: string;
  audioUrl: string;
  videoUrl: string;
  content: string;
};

type Props = {
  value: PartFieldsValue;
  onChange: (next: PartFieldsValue) => void;
  variant: "compact" | "labeled";
};

export function PartTypeSpecificFields({ value, onChange, variant }: Props) {
  if (value.type === "AUDIO") {
    const field = (
      <AdminAudioField
        compact={variant === "compact"}
        label="Audio"
        value={value.audioUrl ?? ""}
        onChange={(v) => onChange({ ...value, audioUrl: v })}
        enableFileUpload
      />
    );
    if (variant === "labeled") {
      return <div className="md:col-span-2">{field}</div>;
    }
    return field;
  }

  if (value.type === "VIDEO") {
    if (variant === "labeled") {
      return (
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-700">Video URL</label>
          <input
            value={value.videoUrl}
            onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="https://…"
          />
        </div>
      );
    }
    return (
      <input
        value={value.videoUrl}
        onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
        placeholder="Video URL"
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
      />
    );
  }

  if (value.type === "TEXT") {
    if (variant === "labeled") {
      return (
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Text content (markdown)
          </label>
          <textarea
            value={value.content}
            onChange={(e) => onChange({ ...value, content: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="Write intro text…"
          />
        </div>
      );
    }
    return (
      <textarea
        value={value.content}
        onChange={(e) => onChange({ ...value, content: e.target.value })}
        rows={2}
        placeholder="Content markdown"
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
      />
    );
  }

  return null;
}

type TypeSelectProps = {
  value: string;
  onChange: (type: string) => void;
  className?: string;
};

export function PartTypeSelect({ value, onChange, className }: TypeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ??
        "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
      }
    >
      {LESSON_PART_TYPES.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
