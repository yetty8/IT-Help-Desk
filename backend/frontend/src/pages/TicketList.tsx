// src/pages/TicketList.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const PRIORITIES = ["URGENT", "HIGH", "MEDIUM", "LOW"] as const;

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-yellow-400",
  LOW: "bg-green-500",
};

const STATUSES = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export default function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | string>("ALL");
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets");
      setTickets(res.data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const updated = Array.from(tickets);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    setTickets(updated);

    try {
      await API.post("/tickets/reorder", {
        tickets: updated.map((t, idx) => ({ id: t.id, order: idx })),
      });
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredTickets = tickets.filter(
    (t) => filterStatus === "ALL" || t.status === filterStatus
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tickets</h2>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded px-2 py-1"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {PRIORITIES.map((priority) => (
          <div key={priority} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{priority}</h3>

            <Droppable droppableId={priority}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {filteredTickets
                    .filter((t) => t.priority === priority)
                    .map((ticket, index) => (
                      <Draggable
                        key={ticket.id}
                        draggableId={String(ticket.id)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 bg-white dark:bg-slate-800 shadow-md rounded-md border dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition flex justify-between items-center"
                            onClick={() => navigate(`/ticket/${ticket.id}`)}
                          >
                            <div>
                              <h4 className="font-semibold text-lg dark:text-slate-100">
                                {ticket.title}
                              </h4>

                              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                <span
                                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/ticket/${ticket.id}`);
                                  }}
                                >
                                  {ticket.status.replace("_", " ")}
                                </span>
                                <span>
                                  {" "}
                                  •{" "}
                                  {ticket.reporter?.name ||
                                    ticket.reporter?.email ||
                                    "Unknown"}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`px-2 py-1 text-white text-xs rounded ${PRIORITY_COLORS[ticket.priority]}`}
                            >
                              {ticket.priority}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
