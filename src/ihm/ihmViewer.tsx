import Dalle from '../assets/Synoptique Dalle.jpg'
import type { MachineParameter } from '../models/machineParameter';
import IhmActionButton from './ihmActionButton';
import IhmValueBadge from './ihmValueBadge';
import { IhmVannes } from './vannes/ihmVannes';

export interface SchemaValue {
  type: "value";
  id: string;
  x: number;
  y: number;
  value: string | number;
}
 
export interface SchemaButton {
  type: "button";
  id: string;
  x: number;
  y: number;
  label: string;
  onClick: () => void;
  active?: boolean;
}

export type SchemaOverlay = SchemaValue | SchemaButton;

export function IhmViewer({ datas, callClose }: { datas:MachineParameter[],  callClose: () => void}) {
  return (
    <div className={`relative inline-block w-full select-none`}>
      <img
      src={Dalle}
        className="block w-full h-auto pointer-events-none"
        draggable={false}
      />
      <button
        id='exit-button'
            onClick={callClose}
            className="absolute w-10 h-10 x-[0] y-[10] rounded-full flex items-center justify-center
            bg-gray-800  text-white
            hover:text-white hover:bg-gray-500 
            transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
      {/* TT01 */}
        <div
          key="TT01"
          className="absolute"
          style={{
            left: `30%`,
            top: `69%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TT01")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* TT02 */}
        <div
          key="TT02"
          className="absolute"
          style={{
            left: `40.3%`,
            top: `57.8%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TT02")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* TT03 */}
        <div
          key="TT03"
          className="absolute"
          style={{
            left: `40.3%`,
            top: `41.6%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TT03")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* TT04 */}
        <div
          key="TT04"
          className="absolute"
          style={{
            left: `40.3%`,
            top: `25.6%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TT04")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* TT05 */}
        <div
          key="TT05"
          className="absolute"
          style={{
            left: `30.3%`,
            top: `15.4%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TT05")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* TTC06_PV */}
        <div
          key="TTC06_PV"
          className="absolute"
          style={{
            left: `16.9%`,
            top: `22.2%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TTC06_PV")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* TTC06_SP */}
        <div
          key="TTC06_SP"
          className="absolute"
          style={{
            left: `16.9%`,
            top: `25.6%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TTC06_SP")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* TT07 */}
        <div
          key="TT07"
          className="absolute"
          style={{
            left: `70.5%`,
            top: `57%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TT07")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* TT08 */}
        <div
          key="TT08"
          className="absolute"
          style={{
            left: `55.8%`,
            top: `11.4%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "TT08")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* DPIC01_PV */}
        <div
          key="DPIC01_PV"
          className="absolute"
          style={{
            left: `26.7%`,
            top: `35.9%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "DPIC01_PV")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>
        
      {/* DPIC01_SP */}
        <div
          key="DPIC01_SP"
          className="absolute"
          style={{
            left: `26.7%`,
            top: `39.5%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "DPIC01_SP")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* FIC02_PV */}
        <div
          key="FIC02_PV"
          className="absolute"
          style={{
            left: `72.1%`,
            top: `47.4%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "FIC02_PV")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* FIC02_SP */}
        <div
          key="FIC02_SP"
          className="absolute"
          style={{
            left: `72.1%`,
            top: `50.4%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "FIC02_SP")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

      {/* H1 */}
        <div
          key="H1"
          className="absolute w-10%"
          style={{
            left: `10.55%`,
            top: `23.3%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "H1")[0].value} w={25} h={25} isRound={false} />
        </div>

      {/* H2 */}
        <div
          key="H2"
          className="absolute w-10%"
          style={{
            left: `35.65%`,
            top: `79.9%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "H2")[0].value} w={25} h={25} isRound={false} />
        </div>

      {/* EV01 */}
        <div
          key="EV01"
          className="absolute w-10%"
          style={{
            left: `38%`,
            top: `12.2%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "EV01")[0].value} w={16} h={26} isRound={false} />
        </div>

      {/* P1 */}
        <div
          key="P1"
          className="absolute w-10%"
          style={{
            left: `7.8%`,
            top: `67.4%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "P1")[0].value} w={29} h={29} isRound={true} />
        </div>
        

      {/* P1_SP_REEL */}
        <div
          key="P1_SP_REEL"
          className="absolute"
          style={{
            left: `9%`,
            top: `71.8%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmValueBadge value={datas.filter(k => k.key === "P1_SP_REEL")[0].value} w={undefined} h={undefined} isRound={false} />
        </div>

        {/* Bouton P1_SP */}
        <div
          key="Button_P1_SP"
          className="absolute w-10%"
          style={{
            left: `10.6%`,
            top: `76%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmActionButton overlay={{
              active: true,
              id:"P1_SP_REEL",
              label: "P1_SP_REEL",
              onClick: () => {},
              type:"button",
              x: 2,
              y:0
            }} />
        </div>

        {/* Bouton P1 */}
        <div
          key="Button_P1"
          className="absolute w-10%"
          style={{
            left: `7.5%`,
            top: `62.4%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmActionButton overlay={{
              active: true,
              id:"P1",
              label: "P1",
              onClick: () => {},
              type:"button",
              x: 2,
              y:0
            }} />
        </div>

         {/* Bouton H1 */}
        <div
          key="Button_H1"
          className="absolute w-10%"
          style={{
            left: `7%`,
            top: `22.6%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmActionButton overlay={{
              active: true,
              id:"H1",
              label: "H1",
              onClick: () => {},
              type:"button",
              x: 2,
              y:0
            }} />
        </div>

         {/* Bouton H2 */}
        <div
          key="Button_H2"
          className="absolute w-10%"
          style={{
            left: `35.6%`,
            top: `84.6%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmActionButton overlay={{
              active: true,
              id:"H2",
              label: "H2",
              onClick: () => {},
              type:"button",
              x: 2,
              y:0
            }} />
        </div>

        {/* Bouton FIC 02  */}
        <div
          key="Button_FIC02_SP"
          className="absolute w-10%"
          style={{
            left: `72.3%`,
            top: `43.2%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmActionButton overlay={{
              active: true,
              id:"FIC02",
              label: "FIC02",
              onClick: () => {},
              type:"button",
              x: 2,
              y:0
            }} />
        </div>

        {/* Bouton EV_MODE  */}
        <div
          key="Button_EV_MODE"
          className="absolute w-10%"
          style={{
            left: `41.8%`,
            top: `12.5%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmActionButton overlay={{
              active: true,
              id:"EV_MODE",
              label: "EV_01",
              onClick: () => {},
              type:"button",
              x: 2,
              y:0
            }} />
        </div>

        {/* Bouton TTC06  */}
        <div
          key="Button_TTC06"
          className="absolute w-10%"
          style={{
            left: `17.1%`,
            top: `18.5%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmActionButton overlay={{
              active: true,
              id:"TTC06",
              label: "TTC06",
              onClick: () => {},
              type:"button",
              x: 2,
              y:0
            }} />
        </div>

          
        {/* Bouton DPIC01  */}
        <div
          key="Button_DPIC01"
          className="absolute w-10%"
          style={{
            left: `26.8%`,
            top: `32.1%`,
            transform: "translate(-50%, -50%)",
          }}
        >
            <IhmActionButton overlay={{
              active: true,
              id:"DPIC01",
              label: "DPIC01",
              onClick: () => {},
              type:"button",
              x: 2,
              y:0
            }} />
        </div>

        <IhmVannes datas={datas} />
    </div>

    
  );
}