import CoverImage from "@/components/CoverImage";

type Props = {
  src?: string | null;
  alt: string;
  title: string;
};

export default function LearnerHeroMedia({ src, alt, title }: Props) {
  return (
    <>
      <div className="sm:hidden">
        <CoverImage
          src={src}
          alt={alt}
          title={title}
          aspectClassName="aspect-[2/1]"
          fit="cover"
          className="rounded-none border-0"
        />
      </div>

      <div className="hidden sm:flex sm:w-52 md:w-56 shrink-0 items-center justify-center self-stretch bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 border-r border-slate-100">
        <CoverImage
          src={src}
          alt={alt}
          title={title}
          aspectClassName="aspect-square"
          fit="cover"
          className="w-full max-w-[9.5rem] rounded-xl shadow-sm ring-1 ring-slate-200/70 border-0"
        />
      </div>
    </>
  );
}
