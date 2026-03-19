import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ScoreScreen.css';

const ScoreScreen = ({ match, onMatchComplete }) => {
        const navigate = useNavigate();
        const [currentMatch, setCurrentMatch] = useState(match);
        const [serving, setServing] = useState('A');
        const [winner, setWinner] = useState(null);
        const [matchPoint, setMatchPoint] = useState(null);
        const [gamePoint, setGamePoint] = useState(null);

        const WIN_SCORE = 21;
        const MAX_SETS = 3;

        useEffect(() => {
            checkWinner();
            checkPoints();
        }, [currentMatch]);

        const checkWinner = () => {
            const teamASets = currentMatch.teamA.sets.filter(s => s >= WIN_SCORE).length;
            const teamBSets = currentMatch.teamB.sets.filter(s => s >= WIN_SCORE).length;

            if (teamASets === 2) setWinner('A');
            else if (teamBSets === 2) setWinner('B');
            else setWinner(null);
        };

        const checkPoints = () => {
            if (winner) return;

            const teamASets = currentMatch.teamA.sets.filter(s => s >= WIN_SCORE).length;
            const teamBSets = currentMatch.teamB.sets.filter(s => s >= WIN_SCORE).length;
            const currentSet = currentMatch.currentSet - 1;
            const scoreA = currentMatch.teamA.sets[currentSet] || 0;
            const scoreB = currentMatch.teamB.sets[currentSet] || 0;

            setMatchPoint(null);
            setGamePoint(null);

            // Match point
            if (teamASets === 1 && teamBSets === 0 && scoreA >= 20 && scoreA > scoreB) {
                setMatchPoint('A');
            } else if (teamBSets === 1 && teamASets === 0 && scoreB >= 20 && scoreB > scoreA) {
                setMatchPoint('B');
            }
            // Game point
            else if (teamASets === 0 && teamBSets === 0) {
                if (scoreA >= 20 && scoreA > scoreB) setGamePoint('A');
                else if (scoreB >= 20 && scoreB > scoreA) setGamePoint('B');
            }
        };

        const handleScore = (team) => {
            if (winner) return;

            setCurrentMatch(prev => {
                const newMatch = JSON.parse(JSON.stringify(prev));
                const currentSet = newMatch.currentSet - 1;

                if (team === 'A') newMatch.teamA.sets[currentSet] += 1;
                else newMatch.teamB.sets[currentSet] += 1;

                const scoreA = newMatch.teamA.sets[currentSet];
                const scoreB = newMatch.teamB.sets[currentSet];

                // Check if set is won
                if ((scoreA >= WIN_SCORE || scoreB >= WIN_SCORE) && Math.abs(scoreA - scoreB) >= 2) {
                    if (newMatch.currentSet < MAX_SETS) {
                        const teamASets = newMatch.teamA.sets.filter(s => s >= WIN_SCORE).length;
                        const teamBSets = newMatch.teamB.sets.filter(s => s >= WIN_SCORE).length;

                        if (teamASets < 2 && teamBSets < 2) {
                            newMatch.currentSet += 1;
                        }
                    }
                }

                setServing(team === 'A' ? 'B' : 'A');
                return newMatch;
            });
        };

        const handleEndMatch = () => {
            if (window.confirm('End match and save to history?')) {
                onMatchComplete({
                    ...currentMatch,
                    completed: true,
                    date: new Date().toISOString(),
                    winner: winner === 'A' ? currentMatch.teamA.players : currentMatch.teamB.players
                });
                navigate('/');
            }
        };

        const getTeamName = (team) => team.players.join(' & ');

        return ( <
                div className = "score-container" >
                <
                div className = "score-header" >
                <
                button className = "back-btn"
                onClick = {
                    () => navigate('/') } > ←Back < /button> <
                div className = "match-info" >
                <
                span className = "match-type" > { currentMatch.matchType.toUpperCase() } < /span> {
                    winner && < span className = "winner-badge" > WINNER! < /span>} {
                            (matchPoint || gamePoint) && !winner && ( <
                                span className = "point-badge" > { matchPoint ? 'MATCH POINT' : 'GAME POINT' } < /span>
                            )
                        } <
                        /div> <
                        /div>

                    <
                    div className = "main-scoreboard" >
                        <
                        div className = "team-score team-a" >
                        <
                        div className = "team-name" > { getTeamName(currentMatch.teamA) } < /div> <
                        div className = "current-score" > { currentMatch.teamA.sets[currentMatch.currentSet - 1] } < /div> {
                            serving === 'A' && < div className = "serve-indicator" > SERVE < /div>} {
                                    (matchPoint === 'A' || gamePoint === 'A') && !winner && ( <
                                        div className = "point-indicator" > { matchPoint === 'A' ? '⚡ MATCH POINT' : '🎯 GAME POINT' } < /div>
                                    )
                                } <
                                /div>

                            <
                            div className = "score-divider" >: < /div>

                            <
                            div className = "team-score team-b" >
                                <
                                div className = "team-name" > { getTeamName(currentMatch.teamB) } < /div> <
                                div className = "current-score" > { currentMatch.teamB.sets[currentMatch.currentSet - 1] } < /div> {
                                    serving === 'B' && < div className = "serve-indicator" > SERVE < /div>} {
                                            (matchPoint === 'B' || gamePoint === 'B') && !winner && ( <
                                                div className = "point-indicator" > { matchPoint === 'B' ? '⚡ MATCH POINT' : '🎯 GAME POINT' } < /div>
                                            )
                                        } <
                                        /div> <
                                        /div>

                                    <
                                    div className = "set-scores" > {
                                            [0, 1, 2].map(i => ( <
                                                div key = { i }
                                                className = { `set-score ${i + 1 === currentMatch.currentSet ? 'current-set' : ''}` } >
                                                Set { i + 1 }: { currentMatch.teamA.sets[i] || 0 } - { currentMatch.teamB.sets[i] || 0 } <
                                                /div>
                                            ))
                                        } <
                                        /div>

                                    <
                                    div className = "score-buttons" >
                                        <
                                        div className = "tap-area"
                                    onClick = {
                                            () => handleScore('A') } >
                                        <
                                        span className = "tap-text" > { winner ? 'Match Ended' : 'Tap to score' } < /span> <
                                        /div> <
                                        div className = "tap-area"
                                    onClick = {
                                            () => handleScore('B') } >
                                        <
                                        span className = "tap-text" > { winner ? 'Match Ended' : 'Tap to score' } < /span> <
                                        /div> <
                                        /div>

                                    <
                                    div className = "action-buttons" >
                                        <
                                        button className = "end-btn"
                                    onClick = { handleEndMatch } > End Match < /button> <
                                        /div> <
                                        /div>
                                );
                        };

                    export default ScoreScreen;