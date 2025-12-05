// src/pages/TicketDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import BackButton from "../components/BackButton";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../context/AuthContext";

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  async function load() {
    setLoading(true);
    try {
      const r = await API.get(`/tickets/${id}`);
      setTicket(r.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await API.post(`/tickets/${id}/comments`, { body: comment });
      setComment("");
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to add comment");
    }
  }

  async function assignTo(assigneeId: number) {
    try {
      await API.post(`/tickets/${id}/assign`, { assigneeId });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to assign ticket");
    }
  }

  async function changeStatus(status: string) {
    try {
      await API.post(`/tickets/${id}/status`, { status });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to update status");
    }
  }

  if (loading) return <div className="flex justify-center"><LoadingSpinner size={2} /></div>;
  if (!ticket) return <div>No ticket found</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <BackButton to="/" />
        <div className="text-sm text-gray-600 dark:text-gray-300">Created: {new Date(ticket.createdAt).toLocaleString()}</div>
      </div>

      <h2 className="text-2xl font-semibold dark:text-slate-100">{ticket.title}</h2>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">By: {ticket.reporter?.name ?? ticket.reporter?.email}</div>
      <p className="mb-4 dark:text-slate-200">{ticket.description}</p>

      <div className="mb-4 flex gap-2 items-center">
        <div className="px-3 py-1 border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded">Status: <strong>{ticket.status}</strong></div>
        <div className="px-3 py-1 border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded">Priority: <strong>{ticket.priority}</strong></div>
      </div>

      <ErrorAlert message={error} />

      <div className="mb-6">
        <h3 className="font-medium">Comments</h3>
        <ul className="space-y-2 mt-2">
          {ticket.comments.map((c:any)=>(
            <li key={c.id} className="border dark:border-slate-600 dark:bg-slate-800 p-3 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-300">{c.author?.name} • {new Date(c.createdAt).toLocaleString()}</div>
              <div className="mt-1 dark:text-slate-200">{c.body}</div>
            </li>
          ))}
        </ul>

        <form onSubmit={postComment} className="mt-4">
          <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded" />
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded">Add Comment</button>
            <button type="button" onClick={() => setComment("")} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 dark:text-slate-100 rounded">Clear</button>
          </div>
        </form>
      </div>

      {/* Admin panel (role-based) */}
      {user?.role === "ADMIN" && (
        <div className="mt-6 p-4 border dark:border-slate-600 rounded bg-yellow-50 dark:bg-yellow-900/30">
          <h4 className="font-medium mb-2 dark:text-slate-100">Admin Controls</h4>
          <div className="flex gap-2 items-center">
            <label className="text-sm dark:text-slate-200">Assign to (user id):</label>
            <input type="number" onKeyDown={(e)=>{ if(e.key === "Enter") assignTo(Number((e.target as HTMLInputElement).value)); }} className="border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-1 rounded w-24" placeholder="userId" />
            <button onClick={() => { const v = (document.querySelector('input[type="number"]') as HTMLInputElement)?.value; if(v) assignTo(Number(v)); }} className="px-3 py-1 bg-blue-600 text-white rounded">Assign</button>

            <label className="text-sm ml-4 dark:text-slate-200">Change status:</label>
            <select onChange={(e)=>changeStatus(e.target.value)} className="border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-1 rounded">
              <option value="">--</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
