import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between gap-4 py-32 px-16 sm:items-start">
        <h2 className="w-full text-2xl font-medium text-center sm:text-left">歡迎來到
          <span className="block sm:inline mt-4 am:mt-0 text-5xl font-semibold"> 記帳小本本</span>
        </h2>

        <Image
          src="/accounting.png"
          width={512}
          height={512}
          className="w-60"
          alt="accounting icon"
        />
        <div className="flex justify-center flex-row gap-4 text-base font-medium">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-font transition-colors hover:bg-primary-dark md:w-[158px]"
            href="/accounting"
          >
            開始記帳
          </Link>
        </div>
      </main>
    </div>
  );
}
