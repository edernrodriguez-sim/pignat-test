import type { MachineParameter } from "../../models/machineParameter";
import { IhmVanne } from "./ihmVanne";

export function IhmVannes({ datas }: { datas:MachineParameter[]}) {
  return (
    <>
      {/** HORIZONTAUX */}
      {/** V2 */}
      <IhmVanne left="30.3%" top="28.8%" w={26} h={16} value={datas.filter(k => k.key === "V2")[0].value} key="V2" />
      {/** V3 */}
      <IhmVanne left="30.3%" top="44.8%" w={26} h={16} value={datas.filter(k => k.key === "V3")[0].value} key="V3" />
      {/** V4 */}
      <IhmVanne left="30.3%" top="60.8%" w={26} h={16} value={datas.filter(k => k.key === "V4")[0].value} key="V4" />
      {/** V5 */}
      <IhmVanne left="38.7%" top="28.2%" w={26} h={16} value={datas.filter(k => k.key === "V5")[0].value} key="V5" />
      {/** V6 */}
      <IhmVanne left="38.7%" top="44.4%" w={26} h={16} value={datas.filter(k => k.key === "V6")[0].value} key="V6" />
      {/** V7 */}
      <IhmVanne left="38.7%" top="60.4%" w={26} h={16} value={datas.filter(k => k.key === "V7")[0].value} key="V7" />
        
      {/** VERTICAUX */}
      {/** V8 */}
      <IhmVanne left="37.8%" top="79.1%" w={16} h={26} value={datas.filter(k => k.key === "V8")[0].value} key="V8" />
      {/** V9 */}
      <IhmVanne left="33.3%" top="77.2%" w={16} h={26} value={datas.filter(k => k.key === "V9")[0].value} key="V9" />
      {/** V11 */}
      <IhmVanne left="47.2%" top="64.7%" w={16} h={26} value={datas.filter(k => k.key === "V11")[0].value} key="V11" />
      {/** V12 */}
      <IhmVanne left="52.6%" top="79.1%" w={16} h={26} value={datas.filter(k => k.key === "V12")[0].value} key="V12" />
      {/** V14 */}
      <IhmVanne left="57.7%" top="48.6%" w={16} h={26} value={datas.filter(k => k.key === "V14")[0].value} key="V14" />
      {/** V15 */}
      <IhmVanne left="60.8%" top="79.2%" w={16} h={26} value={datas.filter(k => k.key === "V15")[0].value} key="V15" />
      {/** V16 */}
      <IhmVanne left="67.5%" top="63.8%" w={16} h={26} value={datas.filter(k => k.key === "V16")[0].value} key="V16" />
    </>
  )
}