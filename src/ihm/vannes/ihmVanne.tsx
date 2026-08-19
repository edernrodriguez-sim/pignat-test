import IhmValueBadge from "../ihmValueBadge";

export function IhmVanne({ value, key, w, h, left, top }:
  { value: string | number | boolean, key: string, w: number, h:number, left: string, top: string }) {
  return (
    <>
          <div
          key={key}
          className="absolute"
          style={{
            left: left,
            top: top,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={value} w={w} h={h} isRound={false} />
        </div>
    </>
  )
}