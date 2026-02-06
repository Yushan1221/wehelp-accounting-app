"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/20/solid";

type TransactionType = "income" | "expense";

interface Transaction {
  id: number;
  text: string; // 項目名稱
  amount: number; // 金額
  type: TransactionType; // 收入 or 支出
}

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // 紀帳列表
  const [type, setType] = useState<TransactionType>("income"); // 收入、支出狀態
  const [inputName, setInputName] = useState(""); // 項目名稱狀態
  const [inputAmount, setInputAmount] = useState(""); // 項目金額狀態

  // 新增帳目
  function handleAddTransaction() {
    if (!inputName || !inputAmount) return alert("請輸入項目和金額！");

    const newTransaction: Transaction = {
      id: Date.now(),
      text: inputName,
      amount: Number(inputAmount),
      type: type,
    };

    // 更新狀態: 記帳列表
    setTransactions([...transactions, newTransaction]);
    console.log(newTransaction.id);
    // 清空狀態
    setInputName("");
    setInputAmount("");
  }

  // 刪除帳目
  function handleDelete(id: number) {
    // 過濾掉id相同那欄，只留id不同的
    const newList = transactions.filter((t) => t.id !== id);
    setTransactions(newList);
  }

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

  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-neutral-700">
      <div className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-start gap-4 py-32 px-6 bg-background sm:px-16">
        <h2 className="w-full text-2xl font-medium text-center mb-4">開始我的記帳</h2>
        
        <div className="h-16 flex justify-between items-center w-full border-y-2 py-2 text-md sm:text-lg">
          <select
            className="h-full px-1 sm:px-4 mr-2 bg-foreground rounded-md text-primary font-bold"
            value={type}
            onChange={(e) => {
              setType(e.target.value as "income" | "expense");
            }}
          >
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>

          <div className="flex w-full h-full justify-between mr-4 ">
            <input
              className="h-full px-1 w-24 sm:w-48 sm:px-4"
              type="text"
              placeholder="輸入項目"
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
              }}
            />

            <input
              className="h-full px-1 w-18 sm:w-36 sm:px-4"
              type="number"
              placeholder="輸入金額"
              value={inputAmount}
              onChange={(e) => {
                setInputAmount(e.target.value);
              }}
            />
          </div>

          <div
            className="flex h-12 items-center justify-center rounded-full bg-primary px-3 sm:px-5 text-font transition-colors hover:bg-primary-dark cursor-pointer"
            onClick={() => handleAddTransaction()}
          >
            {type === "income" ? (
              <PlusIcon className="size-8 font-bold" />
            ) : (
              <MinusIcon className="size-8 font-bold" />
            )}
          </div>
        </div>

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
            <span className={`ml-2 ${totalBalance < 0 ? "text-red-300" : "text-lime-200"}`}>{totalBalance}</span>
          </div>
        </div>

        <ul className="w-full">
          {transactions.map((t) => (
            <li key={t.id} className="w-full flex justify-between px-2 py-4 border-b-1 border-neutral-500">
              <div className="flex justify-between font-bold w-full mr-6">
                <p>{t.text}</p>
                {t.type === "income" ? <p>$+{t.amount}</p> : <p>$-{t.amount}</p>}
              </div>
              
              <div 
                onClick={() => handleDelete(t.id)}
                className="cursor-pointer hover:text-primary transition-colors"
              >
                <TrashIcon className="size-6" />
              </div>
            </li>
          ))}
          {transactions.length === 0 && (
            <p className="text-center mt-4">還沒有紀錄，快記一筆吧！</p>
          )}
        </ul>
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
