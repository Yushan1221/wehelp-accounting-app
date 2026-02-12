"use client";
import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/app/lib/firebase"; // 引入設定好的 firebase

export default function LoginForm() {
  const [isRegistering, setIsRegistering] = useState(false); // 註冊or登入 狀態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    }
    catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        alert(`登入或註冊失敗：${error.code}`);
      } else {
        alert("發生未知錯誤");
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-3 border-second border-4 rounded-3xl">
      <div
        onClick={() => setIsRegistering(!isRegistering)}
        className="flex rounded-full bg-neutral-700 p-1"
      >
        <button 
          type="button"
          className={`
            px-6 py-3 rounded-full font-bold text-lg cursor-pointer transition-all duration-300 
            ${isRegistering 
              ? "bg-primary text-font shadow-md"
              : "text-neutral-400"
            }
          `}>
          註冊
        </button>
        <button 
          type="button"
          className={`
            px-6 py-3 rounded-full font-bold text-lg cursor-pointer transition-all duration-300
            ${!isRegistering 
              ? "bg-primary text-font shadow-md" 
              : "text-neutral-400" 
            }
          `}>
          登入
        </button>
      </div>

      <form 
        className="flex flex-col items-center text-lg font-bold"
        onSubmit={handleSubmit}>
        <div 
          className="flex bg-neutral-700 rounded-full overflow-hidden mb-2"
        >
          <div className="px-5 py-3">信箱</div>
          <input 
            className="px-1"
            onChange={(e) => setEmail(e.target.value)}
            type="email" 
            placeholder="請輸入信箱" 
            required />
        </div>

        <div
          className="flex bg-neutral-700 rounded-full overflow-hidden"
        >
          <div className="px-5 py-3">密碼</div>
          <input 
            className="px-1"
            onChange={(e) => setPassword(e.target.value)}
            type="password" 
            placeholder="請輸入密碼" 
            required />
        </div>

        <button 
          className="py-3 px-6 mt-4 bg-primary rounded-full cursor-pointer hover:bg-primary-dark transition-all duration-300 "
          type="submit">
          {isRegistering ? "註冊" : "登入"}
        </button>
      </form>
    </div>
  );
}
