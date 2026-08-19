import { useState } from 'react';
import Logo from '../assets/Logo.jpg'
import AppExercice from './app.example';

function ExerciceChoice({ backToHome } : { backToHome: () => void }) {
    const [exerciceIndex, setExerciceIndex] = useState<number>(0);

    if (exerciceIndex === 1) {
        return <AppExercice exerciseCode='1' />;
    }
    else if (exerciceIndex === 2) {
        return <AppExercice exerciseCode='2' />;
    }
    else if (exerciceIndex === 3) {
        return <AppExercice exerciseCode='3' />;
    }
    else if (exerciceIndex === 4) {
        return <AppExercice exerciseCode='4' />;
    }
    else if (exerciceIndex === 5) {
        return <AppExercice exerciseCode='5' />;
    }
    
    
    return (
        <>
        <div id="home">
            <img src={Logo} />
            <div>
                <button onClick={() => setExerciceIndex(1)}>
                    Exercice A
                </button>
                <button onClick={() => setExerciceIndex(2)}>
                    Exercice B
                </button>
                <button onClick={() => setExerciceIndex(3)}>
                    Exercice D
                </button>
                <button onClick={() => setExerciceIndex(4)}>
                    Exercice E
                </button>
            </div>
            <button className="mainMenuHomeButton" onClick={() => backToHome()}>
                Retour
            </button>
        </div>        
        </>
    );
}

export default ExerciceChoice;