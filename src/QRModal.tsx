import {  useRef } from "react";
import CopyButton from "./CopyButton";
import QRCodeImage from "./QRCodeImage";
interface ModalProps {
url: string;
  onClose: () => void;
}
// --- Popup Modale ---
function QRModal({ url, onClose } : ModalProps) {
  const overlayRef = useRef(null);


  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "#0d0d0d",
          border: "1px solid #2a2a2a",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "360px",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "1px solid #2a2a2a",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            color: "#888",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#f0e6d3";
            e.currentTarget.style.color = "#f0e6d3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.color = "#888";
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#888",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 0 8px",
              fontFamily: "'Courier New', monospace",
            }}
          >
            Scanner pour accéder
          </p>
          <h2
            style={{
              color: "#f0e6d3",
              fontSize: "20px",
              margin: 0,
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
            }}
          >
            Partager le lien
          </h2>
        </div>

        {/* QR Code */}
        <div
          style={{
            padding: "16px",
            background: "#0d0d0d",
            borderRadius: "12px",
            border: "1px solid #2a2a2a",
          }}
        >
          <QRCodeImage url={url} size={180} />
        </div>

        {/* URL display */}
        <div
          style={{
            width: "100%",
            background: "#111",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#888",
              fontSize: "12px",
              fontFamily: "'Courier New', monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {url}
          </span>
          <CopyButton url={url} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95) }
          to   { opacity: 1; transform: translateY(0)   scale(1)    }
        }
      `}</style>
    </div>
  );
}

export default QRModal;