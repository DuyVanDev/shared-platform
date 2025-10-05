"use client";
import { useState } from "react";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = type === "login" ? "/api/auth/login" : "/api/auth/register";
    const body: any = { email, password };
    if (type === "register") body.name = name;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setMsg(data.error || data.message);
    if (data.token) {
      localStorage.setItem("token", data.token); // Lưu token để call API
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto p-4 border rounded">
      {type === "register" && (
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <input
        className="w-full p-2 border rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full p-2 border rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        {type === "login" ? "Login" : "Register"}
      </button>
      <p className="text-sm text-gray-600">{msg}</p>
    </form>
  );
}
