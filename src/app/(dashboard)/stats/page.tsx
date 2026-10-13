"use client";

import { STATUSES } from "@/lib/constants";
import { useApplications } from "@/hooks/useApplications";

export default function StatsPage() {
  const { data = [] } = useApplications();
  const count = (s: string) => data.filter((a) => a.status === s).length;
  const applied = data.length - count("WISHLIST");
  const responded = count("INTERVIEW") + count("OFFER") + count("REJECTED");

  return (
    <div className="grid max-w-md gap-2">
      {STATUSES.map((s) => (
        <div
          key={s}
          className="flex justify-between rounded border bg-white p-3"
        >
          <span>{s}</span>
          <b>{count(s)}</b>
        </div>
      ))}
      <p className="text-sm">
        Response rate: {applied ? Math.round((responded / applied) * 100) : 0}%
      </p>
    </div>
  );
}
