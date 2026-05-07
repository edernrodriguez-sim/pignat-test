import { useState } from "react";

export default function ShareDropdown({onValueSelected} : {onValueSelected :(selectedValue: string) => void}) {
  const [open, setOpen] = useState(false);
  const label = "Partager";

  const select = (val: string) => {
    onValueSelected(val);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} className="dropdown">
      <button onClick={() => setOpen(!open)}>
        {label} ▼
      </button>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0,
          background: "white", border: "1px solid #ccc", borderRadius: 6 }}
          >
          <div className="dropdown-item" onClick={() => select("0")}>Spectateur actif</div>
          <div className="dropdown-item" onClick={() => select("1")}>Spectateur passif</div>
        </div>
      )}
    </div>
  );
}