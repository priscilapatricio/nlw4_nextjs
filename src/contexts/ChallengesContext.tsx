import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData{
    level: number; 
    currentExperience: number; 
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void; 
    resetChallenge: () => void; 
    experienceToNextLevel: number;
    completeChallenge: () => void;
}

interface ChallengesProviderProps{
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps){
    const [level, setLevel ] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2) 

    useEffect(() => {
        Notification.requestPermission()
    }, [])

    function levelUp() {
        setLevel (level + 1);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge)

        if(Notification.permission === 'granted'){
            new Notification('Novo desafio 🎉', {
                body: `Valendo ${challenge.amount}xp`
            })
        }
    }

    function resetChallenge(){
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge){
            return;
        }

        const { amount } = activeChallenge;

        let finalExpience = currentExperience + amount;

        if (finalExpience >= experienceToNextLevel) {
            finalExpience = finalExpience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExpience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return(
        <ChallengesContext.Provider 
        value={{ 
            level, 
            currentExperience, 
            challengesCompleted, 
            levelUp,
            startNewChallenge, 
            activeChallenge,
            resetChallenge,
            experienceToNextLevel,
            completeChallenge,
         }}
        >
            {children}
        </ChallengesContext.Provider>
    );
}

