/**
 * Offer a generated file. Inside a claude.ai artifact the `downloads` capability shows the viewer a
 * confirmation; when the app runs on its own (npm run dev / static hosting) a normal browser download is used.
 */
export type DownloadResult = { ok: boolean; message: string };

export async function offerDownload(filename: string, data: string): Promise<DownloadResult> {
  const claude = (window as unknown as { claude?: { use?: (n: string) => Promise<unknown> } }).claude;
  if (claude?.use) {
    const d = (await claude.use("downloads")) as null | { save: (r: { filename: string; data: string }) => Promise<unknown> };
    if (!d) return { ok: false, message: "File downloads are not available in this view." };
    try {
      await d.save({ filename, data });
      return { ok: true, message: `Saved ${filename}.` };
    } catch (e) {
      const code = (e as { code?: string })?.code ?? "unavailable";
      if (code === "declined") return { ok: false, message: "Download cancelled." };
      if (code === "rate_limited") return { ok: false, message: "A save prompt is already open. Try again in a moment." };
      return { ok: false, message: `Download unavailable (${code}).` };
    }
  }
  const blob = new Blob([data], { type: filename.endsWith(".csv") ? "text/csv" : "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { ok: true, message: `Downloaded ${filename}.` };
}
