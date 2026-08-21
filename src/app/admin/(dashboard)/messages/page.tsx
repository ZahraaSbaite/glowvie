"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { classNames } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/messages");
    setMessages(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggleRead(m: Message) {
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, isRead: !x.isRead } : x)));
    await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !m.isRead }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-3xl text-ink">Messages</h1>
      <p className="mt-1 text-muted">Submissions from the website contact form.</p>

      <div className="mt-8 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={classNames("card-lux p-5", !m.isRead && "border-brand")}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-ink">{m.name} {!m.isRead && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[10px] text-white">New</span>}</p>
                <p className="text-xs text-muted">{m.email}{m.phone ? ` · ${m.phone}` : ""} · {new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-3 text-xs">
                <button onClick={() => toggleRead(m)} className="flex items-center gap-1 text-brand-dark hover:underline">
                  {m.isRead ? <><Mail size={13} /> Mark Unread</> : <><MailOpen size={13} /> Mark Read</>}
                </button>
                <button onClick={() => remove(m.id)} className="flex items-center gap-1 text-red-500 hover:underline"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
            {m.subject && <p className="mt-2 text-sm font-medium text-ink">{m.subject}</p>}
            <p className="mt-1 text-sm text-muted">{m.message}</p>
          </div>
        ))}
        {!loading && messages.length === 0 && <p className="py-10 text-center text-muted">No messages yet.</p>}
      </div>
    </div>
  );
}
