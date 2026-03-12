import { useState } from "react";

function CopyButton({ url = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? "#1a3a1a" : "transparent",
        border: `1px solid ${copied ? "#4a8a4a" : "#2a2a2a"}`,
        borderRadius: "6px",
        padding: "4px 10px",
        cursor: "pointer",
        color: copied ? "#7bc97b" : "#888",
        fontSize: "11px",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "0.05em",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
}

export default CopyButton;