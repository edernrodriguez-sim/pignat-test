
// ─── Badge valeur ─────────────────────────────────────────────────────────────
function IhmValueBadge({ value, w, h, isRound }: { value: string | number | boolean, w: number | undefined, h: number | undefined, isRound: boolean }) {
  const isBoolean = typeof value === "boolean";
  const wValue = w ?? 1;
  const hValue = h ?? 1;
    return (
    <div className="
      flex flex-col items-center gap-1
      rounded-lg px-2 py-1
      min-w-[4rem] 
      pointer-events-none
    "> 
      {isBoolean ? (
        <span
          className={` ${isRound ? "round" : "rounded-sm"}`}
          style={{
            width:  wValue,
            height: hValue,
            backgroundColor: value ? "#02fa0a" : "#ef4444", // green-500 / red-500
            boxShadow: value
              ? "0 0 6px rgba(34,197,94,0.6)"
              : "0 0 6px rgba(239,68,68,0.6)",
          }}
        />
      ) : (
        <span className="text-black text-xs font-bold leading-tight">
          {value}
        </span>
      )}
    </div>
  );

}
export default IhmValueBadge;
