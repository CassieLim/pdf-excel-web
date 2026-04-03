"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("请选择 PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("https://pdf-excel-api-qmt1.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("转换失败");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "result.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("上传或转换失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>PDF 转 Excel 工具</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "转换中..." : "上传并转换"}
      </button>
    </main>
  );
}