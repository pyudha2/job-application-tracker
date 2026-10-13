"use client";

import { useRouter } from "next/navigation";
import { STATUSES } from "@/lib/constants";
import { useSave, type Application } from "@/hooks/useApplications";

export default function ApplicationForm({ app }: { app?: Application }) {
  const router = useRouter();
  const save = useSave(app?.id);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    save.mutate(Object.fromEntries(new FormData(e.currentTarget)), {
      onSuccess: () => router.push("/board"),
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-lg gap-3">
      <input
        name="company"
        placeholder="Company"
        defaultValue={app?.company}
        required
      />
      <input
        name="position"
        placeholder="Position"
        defaultValue={app?.position}
        required
      />
      <input
        name="link"
        type="url"
        placeholder="Job link"
        defaultValue={app?.link ?? ""}
      />
      <input
        name="salary"
        placeholder="Salary"
        defaultValue={app?.salary ?? ""}
      />
      <input
        name="deadline"
        type="date"
        defaultValue={app?.deadline?.slice(0, 10)}
      />
      <select name="status" defaultValue={app?.status ?? "WISHLIST"}>
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <textarea
        name="notes"
        rows={5}
        placeholder="Notes / interview notes"
        defaultValue={app?.notes ?? ""}
      />
      {save.error && (
        <p className="text-sm text-red-500">{save.error.message}</p>
      )}
      <button className="btn" disabled={save.isPending}>
        Save
      </button>
    </form>
  );
}
