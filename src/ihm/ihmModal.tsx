import { IhmViewer } from "./ihmViewer";
import type { MachineParameter } from "../models/machineParameter";
import { useEffect } from "react";

// export function IhmModal({overlays}: {overlays: SchemaOverlay[]}) {
export function IhmModal({datas, callClose}: {datas: MachineParameter[], callClose: () => void }) {
 
  // Fermer avec Échap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") callClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
 
  // Bloquer le scroll du body quand ouvert
  // useEffect(() => {
    document.body.style.overflow ="";
  //   return () => { document.body.style.overflow = ""; };
  // }, [open]);
 
  return (
    <>
      {/* Backdrop + modale */}
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => callClose()} // clic sur le fond = fermer
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
              <IhmViewer
                // imageSrc={imageSrc}
                // imageAlt={imageAlt}
                // overlays={overlays}
                callClose={callClose}
                datas={datas}
              />
              
              {/* <IhmInputModal /> */}
            </div>
          </div>
        </div>
    </>
  );
}