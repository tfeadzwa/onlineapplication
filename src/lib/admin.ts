import type { DocItem } from "@/components/admin/DocumentViewer";

export const SECTIONS: { key: string; label: string }[] = [
  { key: "student-info", label: "Student Information" },
  { key: "contact", label: "Contact Details" },
  { key: "mature-entry", label: "Mature Entry" },
  { key: "programme", label: "Programme Choice" },
  { key: "o-level", label: "Ordinary Level" },
  { key: "a-level", label: "Advanced Level" },
  { key: "post-school", label: "Post-School" },
  { key: "employment", label: "Employment History" },
  { key: "payment", label: "Payment" },
];

/** Walks application data and returns every uploaded document (objects with a *File name + *Path). */
export const collectDocuments = (data: Record<string, any>): DocItem[] => {
  const out: DocItem[] = [];
  const walk = (v: any, section: string) => {
    if (Array.isArray(v)) return v.forEach((x) => walk(x, section));
    if (!v || typeof v !== "object") return;
    for (const k of Object.keys(v)) {
      if (k.endsWith("Path") && typeof v[k] === "string" && v[k]) {
        const nameKey = k.replace(/Path$/, "File");
        out.push({ path: v[k], name: v[nameKey] || v[k].split("/").pop(), section });
      } else if (typeof v[k] === "object") walk(v[k], section);
    }
  };
  SECTIONS.forEach((s) => walk(data?.[s.key], s.label));
  return out;
};

export const humanize = (k: string) =>
  k.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").replace(/^./, (c) => c.toUpperCase()).trim();

export const applicantName = (p: any, data: any) => {
  const si = data?.["student-info"] || {};
  return p?.full_name || [si.firstName, si.lastName].filter(Boolean).join(" ") || p?.email || "Unnamed applicant";
};
