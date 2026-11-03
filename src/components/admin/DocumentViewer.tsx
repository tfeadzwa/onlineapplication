import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileWarning, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface DocItem { name: string; path: string; section: string }

const ext = (n: string) => n.split(".").pop()?.toLowerCase() || "";

const DocumentViewer = ({ doc, onClose }: { doc: DocItem | null; onClose: () => void }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const docxRef = useRef<HTMLDivElement>(null);
  const type = doc ? ext(doc.name) : "";

  useEffect(() => {
    setUrl(null); setError(false);
    if (!doc) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.storage.from("documents").createSignedUrl(doc.path, 600);
      if (cancelled) return;
      if (error || !data) { setError(true); setLoading(false); return; }
      setUrl(data.signedUrl);
      if (type === "docx") {
        try {
          const blob = await (await fetch(data.signedUrl)).blob();
          const { renderAsync } = await import("docx-preview");
          if (docxRef.current && !cancelled) {
            docxRef.current.innerHTML = "";
            await renderAsync(blob, docxRef.current, undefined, { inWrapper: true, ignoreWidth: false });
          }
        } catch { setError(true); }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [doc, type]);

  return (
    <Dialog open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 py-4 border-b flex-row items-center justify-between space-y-0 pr-12">
          <div className="min-w-0">
            <DialogTitle className="font-heading truncate">{doc?.name}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{doc?.section}</p>
          </div>
          {url && (
            <Button asChild size="sm" variant="outline" className="rounded-full shrink-0">
              <a href={url} target="_blank" rel="noreferrer" download={doc?.name}><Download className="w-4 h-4 mr-1.5" />Download</a>
            </Button>
          )}
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-muted/40 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          )}
          {error && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
              <FileWarning className="w-10 h-10 text-destructive" />
              <p className="font-medium">This document could not be opened.</p>
            </div>
          )}
          {!error && url && type === "pdf" && <iframe src={url} title={doc?.name} className="w-full h-full border-0" />}
          {!error && url && ["jpg", "jpeg", "png", "gif", "webp"].includes(type) && (
            <div className="min-h-full flex items-center justify-center p-6">
              <img src={url} alt={doc?.name} className="max-w-full max-h-[75vh] rounded-lg shadow-lg bg-card" />
            </div>
          )}
          {type === "docx" && <div ref={docxRef} className="docx-host p-4" />}
          {!error && url && type === "doc" && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
              <FileWarning className="w-10 h-10 text-muted-foreground" />
              <p className="font-medium">Older Word (.doc) files can't be previewed in the browser.</p>
              <Button asChild className="rounded-full"><a href={url} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-1.5" />Open file</a></Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
