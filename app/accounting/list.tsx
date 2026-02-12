import { TrashIcon } from "@heroicons/react/20/solid";
import { Transaction } from "@/app/lib/definitions";
import { db } from "@/app/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

interface Props {
  transactions: Transaction[],
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export default function AccountingList({ transactions, setTransactions }: Props) {

  // 刪除帳目
  async function handleDelete(id: string) {
    if (!confirm("確定要刪除這筆紀錄嗎？")) return;

    try {
      // 刪除 firestore 的這筆資料
      const docRef = doc(db, "Transactions", String(id)); // 定位要刪除的 doc
      await deleteDoc(docRef);
    }
    catch (error) {
      console.error("刪除失敗：", error);
      alert("刪除失敗，請稍後再試。");
    }
  }

  return (
    <ul className="w-full">
      {transactions.map((t) => (
        <li
          key={t.id}
          className="w-full flex justify-between px-2 py-4 border-b-1 border-neutral-500"
        >
          <div className="flex justify-between font-bold w-full mr-6">
            <p>{t.text}</p>
            {t.type === "income" ? (
              <p className="text-lime-200">$+{t.amount}</p>
            ) : (
              <p className="text-red-300">$-{t.amount}</p>
            )}
          </div>

          <div
            onClick={() => handleDelete(t.id)}
            className="cursor-pointer hover:text-primary transition-colors"
          >
            <TrashIcon className="size-6 hover:text-red-300" />
          </div>
        </li>
      ))}
      {transactions.length === 0 && (
        <p className="text-center mt-4">還沒有紀錄，快記一筆吧！</p>
      )}
    </ul>
  );
}
