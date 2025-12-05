import React, { useEffect, useState } from "react";
import API from "../api";

export default function AdminUsers(){
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load(){ setLoading(true); const r = await API.get("/admin/users"); setUsers(r.data); setLoading(false); }
  useEffect(()=>{ load(); }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <ul className="space-y-2">
        {users.map(u=>(
          <li key={u.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-500">{u.email} • {u.role}</div>
            </div>
            <div>
              {/* future: edit / delete */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
