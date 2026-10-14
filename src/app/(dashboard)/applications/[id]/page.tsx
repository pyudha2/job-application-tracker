"use client";

import { useParams, useRouter } from "next/navigation";
import ApplicationForm from "@/components/forms/ApplicationForm";
import { useApplication, useDelete } from "@/hooks/useApplications";

export default function ApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: app, isLoading } = useApplication(id);
  const del = useDelete();

  if (isLoading) return <p>Loading...</p>;
  if (!app) return <p>Not found</p>;

  return (
    <div className="grid gap-6">
      <ApplicationForm app={app} />
      <section>
        <h2 className="mb-2 font-semibold">History</h2>
        <ul className="text-sm text-gray-600">
          {app.history?.map((h) => (
            <li key={h.id}>
              {h.status} - {new Date(h.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
      <button
        className="btn w-fit bg-red-600"
        onClick={() =>
          confirm("Delete this application?") &&
          del.mutate(app.id, { onSuccess: () => router.push("/board") })
        }
      >
        Delete
      </button>
    </div>
  );
}
