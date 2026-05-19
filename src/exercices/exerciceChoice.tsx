import { useState } from 'react';
import Logo from '../assets/Logo.jpg'
import AppExercice from './app.example';

function ExerciceChoice() {
    const [exerciceIndex, setExerciceIndex] = useState<number>(0);

    if (exerciceIndex === 1) {
        return <AppExercice />;
    }
    
    
    return (
        <>
        <div id="home">
            <img src={Logo} />
            <div>
                <button onClick={() => setExerciceIndex(1)}>
                    Exercice A
                </button>
            </div>
        </div>        
        </>
    );
}

export default ExerciceChoice;