"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Status } from "@/lib/constants";

export type Application = {
  id: string;
  company: string;
  position: string;
  link: string | null;
  salary: string | null;
  deadline: string | null;
  notes: string | null;
  status: Status;
  updatedAt: string;
  history?: { id: string; status: Status; createdAt: string }[];
};

const KEY = ["applications"];

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => null))?.error ?? "Request failed",
    );
  return res.json();
}

export const useApplications = () =>
  useQuery({
    queryKey: KEY,
    queryFn: () => api<Application[]>("/api/applications"),
  });

export const useApplication = (id: string) =>
  useQuery({
    queryKey: [...KEY, id],
    queryFn: () => api<Application>(`/api/applications/${id}`),
  });

export function useSave(id?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api<Application>(id ? `/api/applications/${id}` : "/api/applications", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useMove() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      api(`/api/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onMutate: ({ id, status }) =>
      qc.setQueryData<Application[]>(KEY, (old) =>
        old?.map((a) => (a.id === id ? { ...a, status } : a)),
      ),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`/api/applications/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
