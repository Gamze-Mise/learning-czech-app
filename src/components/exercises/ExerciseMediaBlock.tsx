type Props = {
  imageUrl?: string | null;
  audioUrl?: string | null;
};

export default function ExerciseMediaBlock({ imageUrl, audioUrl }: Props) {
  return (
    <>
      {imageUrl ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote lesson URLs */}
          <img
            src={imageUrl}
            alt=""
            className="w-full max-w-md rounded-lg object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      ) : null}
      {audioUrl ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <audio controls src={audioUrl} className="w-full max-w-md" preload="metadata" />
        </div>
      ) : null}
    </>
  );
}
