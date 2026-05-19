// ─── Bouton action ────────────────────────────────────────────────────────────

import { useState } from "react";
import type { SchemaButton } from "./ihmViewer";
import { useMachineParameters } from "./machineParameterContext/machineParameterProvider";

 
function IhmActionButton({ overlay }: { overlay: SchemaButton }) {
  const [pressed, setPressed] = useState(false);
 // ── On récupère openEditModal directement depuis le Context ─────────────
  // Pas besoin que SchemaModal ou SchemaViewer transmettent quoi que ce soit.
  const { openEditModal } = useMachineParameters();

  return (
    <button
      onClick={() => openEditModal(overlay.id)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`
        relative flex items-center justify-center
        text-[0.6rem] font-bold uppercase tracking-wide
        transition-all duration-150
        whitespace-nowrap px-4 py-2
        cursor-pointer shadow-md/50
        bg-gray-100 text-black
        hover:bg-gray-700
        hover:text-gray-100
        ${pressed ? "scale-95" : "scale-100"}
      `}
    >
      {overlay.label}
    </button>
  );
}

export default IhmActionButton;
