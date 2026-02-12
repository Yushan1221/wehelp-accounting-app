"use client";
import React, { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { TransactionType, Transaction } from "@/app/lib/definitions";
import { useAuth } from "@/app/lib/auth-context";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface Props {
  transactions: Transaction[],
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export default function AccountingForm({ transactions, setTransactions }: Props) {
  const { user, loading } = useAuth();
  const [type, setType] = useState<TransactionType>("income"); // 收入、支出狀態
  const [inputName, setInputName] = useState(""); // 項目名稱狀態
  const [inputAmount, setInputAmount] = useState(""); // 項目金額狀態

  // 新增記帳項目
  const handleSubmit = async () => {
    if (!inputName || !inputAmount) return alert("請輸入項目和金額！");
    if (!user) return alert("請先登入！");

    try {
      const transactionData = {
        userId: user.uid,
        text: inputName,
        amount: Number(inputAmount),
        type: type,
        createdAt: new Date(),   // 方便排序
      };

      // 新增到 firestore
      await addDoc(collection(db, "Transactions"), transactionData);

    }
    catch (error) {
      console.error("寫入資料庫失敗：", error);
      alert("新增項目失敗，請稍後再試。");
    }
    finally {
      // 清空狀態
      setInputName("");
      setInputAmount("");
    }
  }

  return (
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
        onClick={handleSubmit}
      >
        {type === "income" ? (
          <PlusIcon className="size-8 font-bold" />
        ) : (
          <MinusIcon className="size-8 font-bold" />
        )}
      </div>
    </div>
  );
}
