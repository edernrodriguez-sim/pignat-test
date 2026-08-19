interface TableProps {
  headers: string[];
  rows: string[][];
  className?: string;
}

export function Table({ headers, rows, className = "" }: TableProps) {
  return (
    <div
        style={{
        background: "#d9d9d9",
        border: "1px solid #9c9c9f",
        boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
        borderRadius: "1.5vh",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "absolute",
        right:"3%",
        bottom:"25%",
        minWidth:"10vw",
        zIndex: 100
        }}
        className={`overflow-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr style={{background: "linear-gradient(135deg, #313131 0%, #161616 100%)"}} className="text-white">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {headers.map((_, ci) => (
                <td key={ci} className="px-4 py-2 text-center border-t border-gray-200 text-gray-700">
                  {row[ci] ?? ""}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-4 text-center text-gray-400 border-t border-gray-200"
              >
                Aucune donnée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}