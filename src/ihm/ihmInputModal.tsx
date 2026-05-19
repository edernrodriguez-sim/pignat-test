import { useState, useEffect } from "react";

export function IhmInputModal() {
  const [open, setOpen] = useState(true);
 
  // Fermer avec Échap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
 
  // Bloquer le scroll du body quand ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
 
  return (
    <>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2
          px-2 py-2 rounded-lg
          bg-gray-800 hover:bg-gray-700
          border border-gray-600 hover:border-blue-400
          text-gray-300 hover:text-blue-300
          text-sm font-semibold
          transition-all duration-150
          cursor-pointer
        "
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        {/* {triggerLabel} */}
      </button>
 
      {/* Backdrop + modale */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)} // clic sur le fond = fermer
        >
          <div
            className="
              relative w-full max-w-6xl max-h-[95vh]
              bg-gray-900 rounded-2xl
              border border-gray-700
              shadow-2xl shadow-black/60
              overflow-hidden
              flex flex-col
            "
            onClick={(e) => e.stopPropagation()} // empêche la fermeture au clic sur la modale
          >
            {/* Contenu : image + overlays */}
            <div className="overflow-auto p-4 flex items-center justify-center">
           
            </div>
          </div>
        </div>
      )}
    </>
  );
}
