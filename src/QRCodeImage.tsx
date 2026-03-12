// --- Génération QR Code (algorithme simplifié via API externe) ---
function QRCodeImage({ url = "", size = 200 }) {
  const encoded = encodeURIComponent(url);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=0d0d0d&color=f0e6d3&format=svg&margin=2`;
  return (
    <img
      src={src}
      alt="QR Code"
      width={size}
      height={size}
      style={{ display: "block", borderRadius: "4px" }}
    />
  );
}

export default QRCodeImage;