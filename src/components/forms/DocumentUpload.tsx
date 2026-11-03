import { useState } from "react";
import { Upload, Loader2, FileCheck2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Props {
  fileName?: string;
  filePath?: string;
  onChange: (name: string, path: string) => void;
  label?: string;
  compact?: boolean;
}

const MAX = 10 * 1024 * 1024;

/** Uploads a document to secure storage under the signed-in user's folder. */
const DocumentUpload = ({ fileName, filePath, onChange, label = "Click to upload file", compact }: Props) => {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (file.size > MAX) { toast.error("File is too large (max 10 MB)."); return; }
    setBusy(true);
    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${user.id}/${crypto.randomUUID()}-${safe}`;
    const { error } = await supabase.storage.from("documents").upload(path, file, { contentType: file.type || undefined });
    setBusy(false);
    if (error) { toast.error("Upload failed. Please try again."); return; }
    onChange(file.name, path);
    toast.success("Document uploaded");
  };

  const uploaded = !!fileName && !!filePath;

  return (
    <label className={`flex items-center gap-3 ${compact ? "p-3" : "p-4"} border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploaded ? "border-success/40 bg-success/5" : "hover:border-primary/50"}`}>
      {busy ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : uploaded ? <FileCheck2 className="w-5 h-5 text-success" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
      <span className={`flex-1 truncate ${compact ? "text-xs" : "text-sm"} ${uploaded ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {busy ? "Uploading..." : fileName ? (filePath ? fileName : `${fileName} (please re-upload)`) : label}
      </span>
      {uploaded && !busy && (
        <button type="button" onClick={(e) => { e.preventDefault(); onChange("", ""); }} className="text-muted-foreground hover:text-destructive" aria-label="Remove file">
          <X className="w-4 h-4" />
        </button>
      )}
      <input type="file" className="hidden" disabled={busy} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handle} />
    </label>
  );
};

export default DocumentUpload;
