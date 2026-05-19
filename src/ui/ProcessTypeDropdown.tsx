import { useState } from "react";
import { LaunchType } from "../rules/RulesSystem";

export default function CustomDropdown({onValueSelected} :
    {onValueSelected :(selectedValue: LaunchType) => void}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("Toutes");
  const values: string[] = ["Toutes", "Continue", "Discontinu", "Remplissage"];
  const select = (index: number, val: LaunchType) => {
    onValueSelected(val);
    setLabel(values[index]);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} className="rule-process-dropdown">
      <button onClick={() => setOpen(!open)}>
        Type : {label} ▼
      </button>

      {open && (
        <div className="customDropdown" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0,
          background: "white", border: "1px solid #ccc", borderRadius: 6 }}
          >
          <div className="dropdown-item" onClick={() => select(0, LaunchType.All) }>Toutes</div>
          <div className="dropdown-item" onClick={() => select(1, LaunchType.Continu)}>Continu</div>
          <div className="dropdown-item" onClick={() => select(2, LaunchType.Discontinu)}>Discontinu</div>
          <div className="dropdown-item" onClick={() => select(2, LaunchType.Remplissage)}>Remplissage</div>
        </div>
      )}
    </div>
  );
}