"use client";

import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import Link from "next/link";
import { useState } from "react";
import { STATUSES, type Status } from "@/lib/constants";
import {
  useApplications,
  useMove,
  type Application,
} from "@/hooks/useApplications";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { timeZone: "UTC" });

function Card({ app }: { app: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: app.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        touchAction: "none",
      }}
      className={`rounded border bg-white p-3 text-sm shadow-sm ${isDragging ? "relative z-10 opacity-70" : ""}`}
    >
      <Link
        href={`/applications/${app.id}`}
        className="font-medium hover:underline"
      >
        {app.company}
      </Link>
      <p className="text-gray-500">{app.position}</p>
      {app.deadline && (
        <p className="text-xs text-red-500">{fmt(app.deadline)}</p>
      )}
    </div>
  );
}

function Column({ status, apps }: { status: Status; apps: Application[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-32 w-64 shrink-0 flex-col gap-2 rounded p-2 ${isOver ? "bg-gray-200" : "bg-gray-100"}`}
    >
      <h2 className="text-sm font-semibold">
        {status} ({apps.length})
      </h2>
      {apps.map((a) => (
        <Card key={a.id} app={a} />
      ))}
    </div>
  );
}

export default function Board() {
  const { data = [] } = useApplications();
  const move = useMove();
  const [q, setQ] = useState("");
  const [now] = useState(() => Date.now());
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const shown = data.filter((a) =>
    `${a.company} ${a.position}`.toLowerCase().includes(q.toLowerCase()),
  );
  const soon = data.filter(
    (a) =>
      a.deadline &&
      !["OFFER", "REJECTED"].includes(a.status) &&
      new Date(a.deadline).getTime() - now < 3 * 864e5,
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    const app = data.find((a) => a.id === active.id);
    if (app && over && over.id !== app.status)
      move.mutate({ id: app.id, status: over.id as Status });
  }

  return (
    <>
      {soon.length > 0 && (
        <div className="mb-4 rounded border border-amber-300 bg-amber-50 p-3 text-sm">
          {soon.map((a) => (
            <p key={a.id}>
              {a.company} - deadline {fmt(a.deadline!)}
            </p>
          ))}
        </div>
      )}
      <div className="mb-4 flex gap-3">
        <input
          className="max-w-xs"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Link href="/applications/new" className="btn">
          New
        </Link>
      </div>
      <DndContext id="board" sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STATUSES.map((s) => (
            <Column
              key={s}
              status={s}
              apps={shown.filter((a) => a.status === s)}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
}
