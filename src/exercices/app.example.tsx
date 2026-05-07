import { Livelink } from "@3dverse/livelink-react";
import { LoadingOverlay } from "@3dverse/livelink-react-ui";
import ExerciceCanvas from "./exerciceCanvas";
import type { Exercise } from "./exercice";
import getExercise1 from "./exercice1";



const scene_id = "05b63dcd-ce5c-4e8f-b363-89a38118462c";
const token    = "public_wfVLwtMF9Rg0rp_k";
let myExercise: Exercise;
// ─── AppExercice ──────────────────────────────────────────────────────────────
// Ce composant ne fait QUE monter <Livelink> et passer l'exercice à ExerciceCanvas.
// Il ne touche PAS à LivelinkContext (il est hors du Provider).

export default function AppExercice() {
    myExercise = getExercise1();
  return (
    <Livelink
      sceneId={scene_id}
      token={token}
      isTransient={true}
      autoJoinExisting={false}
      LoadingPanel={LoadingOverlay}
    >
      {/* ExerciceCanvas est enfant de <Livelink> : il a accès au contexte */}
      <ExerciceCanvas exercise={myExercise} />
    </Livelink>
  );
}