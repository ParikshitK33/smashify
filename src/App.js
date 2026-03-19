import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SetupScreen from './components/SetupScreen';
import ScoreScreen from './components/ScoreScreen';
import HistoryScreen from './components/HistoryScreen';
import { getMatches, saveMatch } from './utils/storage';
import './styles/App.css';

function App() {
    const [currentMatch, setCurrentMatch] = useState(null);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        setMatches(getMatches());
    }, []);

    const handleStartMatch = (matchData) => {
        const newMatch = {
            id: Date.now().toString(),
            ...matchData,
            currentSet: 1,
            teamA: {
                ...matchData.teamA,
                sets: [0, 0, 0]
            },
            teamB: {
                ...matchData.teamB,
                sets: [0, 0, 0]
            },
            completed: false
        };
        setCurrentMatch(newMatch);
    };

    const handleMatchComplete = (finalMatch) => {
        const updatedMatches = saveMatch(finalMatch);
        setMatches(updatedMatches);
        setCurrentMatch(null);
    };

    return ( <
            Router >
            <
            div className = "app" >
            <
            Routes >
            <
            Route path = "/"
            element = { < SetupScreen onStartMatch = { handleStartMatch }
                />}  /
                >
                <
                Route
                path = "/score"
                element = {
                    currentMatch ? ( <
                        ScoreScreen match = { currentMatch }
                        onMatchComplete = { handleMatchComplete }
                        />
                    ) : ( <
                        Navigate to = "/" / >
                    )
                }
                /> <
                Route
                path = "/history"
                element = { < HistoryScreen matches = { matches }
                    />}  /
                    >
                    <
                    /Routes> <
                    /div> <
                    /Router>
                );
            }

            export default App;