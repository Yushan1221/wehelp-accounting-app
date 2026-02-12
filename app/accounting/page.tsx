"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AccountingForm from "./form";
import AccountingList from "./list";
import { Transaction } from "@/app/lib/definitions";
import { useAuth } from "@/app/lib/auth-context";
import { db } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

export default function Page() {
  const { user, loading } = useAuth();
  const [listLoading, setListLoading] = useState(true);
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]); // 紀帳列表

  // 未登入便踢回首頁
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // 初始獲取 Firestore 資料以及即時更新
  useEffect(() => {
    // 只有在 user 存在時才啟動
    if (!user) return;

    // 建立查詢
    const q = query(
      collection(db, "Transactions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    // onSnapshot 可以即時更新，如果資料庫有變動就會啟動，會回傳一個停止監聽的函式 unsubscribe
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const list: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...doc.data(),
          } as unknown as Transaction);
        });

        // 更新本地狀態
        setTransactions(list);

        // 資料更新結束
        setListLoading(false);
      },
      (error) => {
        console.error("讀取資料失敗：", error);
        setListLoading(false);
      },
    );

    // 清理函數
    return () => unsubscribe();
  }, [user]);

  // 計算總額
  const totalBalance = transactions.reduce((acc, item) => {
    return item.type === "income" ? acc + item.amount : acc - item.amount;
  }, 0);

  // 計算總支出
  const totalExpense = transactions.reduce((acc, item) => {
    return item.type === "expense" ? acc + item.amount : acc;
  }, 0);

  // 計算總收入
  const totalIncome = transactions.reduce((acc, item) => {
    return item.type === "income" ? acc + item.amount : acc;
  }, 0);

  if (loading)
    return (
      <div className="flex justify-center item-center p-10">讀取中...</div>
    );
  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-neutral-700">
      <div className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-start gap-4 py-32 px-6 bg-background sm:px-16">
        <h2 className="w-full text-2xl font-medium text-center mb-4">
          開始我的記帳
        </h2>

        <AccountingForm
          transactions={transactions}
          setTransactions={setTransactions}
        />

        <div className="flex justify-between items-center w-full border-b-2 py-2 text-md">
          <div>
            支出:
            <span className="ml-2 text-red-300">{totalExpense}</span>
          </div>
          <div>
            收入:
            <span className="ml-2 text-lime-200">{totalIncome}</span>
          </div>
          <div>
            結餘:
            <span
              className={`ml-2 font-bold ${totalBalance < 0 ? "text-red-300" : "text-lime-200"}`}
            >
              {totalBalance}
            </span>
          </div>
        </div>

        {listLoading ? (
          <div className="text-center mt-4">
            載入記帳列表中...
          </div>
        ) : (
          <AccountingList
            transactions={transactions}
            setTransactions={setTransactions}
          />
        )}

        <div className="flex justify-center flex-row mt-4 gap-4 text-base font-medium">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-font transition-colors hover:bg-primary-dark"
            href="/"
          >
            回到首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
