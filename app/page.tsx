"use client";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./ui/login-form";
import { useAuth } from "@/app/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center item-center p-10">讀取中...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start gap-8 py-32 px-16 sm:items-start">
        <h2 className="w-full text-2xl font-medium text-center sm:text-left">
          歡迎來到
          <span className="block sm:inline mt-4 am:mt-0 text-5xl font-semibold">
            {" "}
            記帳小本本
          </span>
        </h2>
        
        {/* 已登入狀態顯示"開始記帳"按鈕 : 未登入顯示登入表單 */}
        {user ? (
          <div className="flex justify-center flex-row gap-4 text-base font-medium">
            <Link
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-font transition-colors hover:bg-primary-dark md:w-[158px]"
              href="/accounting"
            >
              開始記帳
            </Link>
          </div>
        ) : (
          <>
            <p className="text-lg">請登入或註冊即可開始記帳</p>
            <LoginForm />
          </>
        )}
      </main>
    </div>
  );
}
