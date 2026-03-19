import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SetupScreen.css';

const SetupScreen = ({ onStartMatch }) => {
    const navigate = useNavigate();
    const [matchType, setMatchType] = useState('singles');
    const [teamA, setTeamA] = useState(['', '']);
    const [teamB, setTeamB] = useState(['', '']);

    const handleMatchTypeChange = (type) => {
        setMatchType(type);
        if (type === 'singles') {
            setTeamA([teamA[0], '']);
            setTeamB([teamB[0], '']);
        }
    };

    const handleStart = () => {
        const teamAPlayers = matchType === 'singles' ?
            [teamA[0]].filter(name => name.trim()) :
            teamA.filter(name => name.trim());

        const teamBPlayers = matchType === 'singles' ?
            [teamB[0]].filter(name => name.trim()) :
            teamB.filter(name => name.trim());

        if (teamAPlayers.length === 0 || teamBPlayers.length === 0) {
            alert('Please enter player names');
            return;
        }

        onStartMatch({
            matchType,
            teamA: {
                players: teamAPlayers,
                sets: [0, 0, 0]
            },
            teamB: {
                players: teamBPlayers,
                sets: [0, 0, 0]
            }
        });
        navigate('/score');
    };

    return ( <
        div className = "setup-container" >
        <
        h1 className = "logo" > SMASHIFY < /h1> <
        h2 className = "subtitle" > Badminton Scoreboard < /h2>

        <
        div className = "match-type-selector" >
        <
        button className = { `type-btn ${matchType === 'singles' ? 'active' : ''}` }
        onClick = {
            () => handleMatchTypeChange('singles') } >
        Singles <
        /button> <
        button className = { `type-btn ${matchType === 'doubles' ? 'active' : ''}` }
        onClick = {
            () => handleMatchTypeChange('doubles') } >
        Doubles <
        /button> <
        /div>

        <
        div className = "teams-container" >
        <
        div className = "team-section" >
        <
        h3 className = "team-label" > SIDE A < /h3> <
        div className = "player-inputs" >
        <
        input type = "text"
        placeholder = "Player 1"
        value = { teamA[0] }
        onChange = {
            (e) => setTeamA([e.target.value, teamA[1]]) }
        className = "player-input" /
        > {
            matchType === 'doubles' && ( <
                input type = "text"
                placeholder = "Player 2"
                value = { teamA[1] }
                onChange = {
                    (e) => setTeamA([teamA[0], e.target.value]) }
                className = "player-input" /
                >
            )
        } <
        /div> <
        /div>

        <
        div className = "vs-divider" > VS < /div>

        <
        div className = "team-section" >
        <
        h3 className = "team-label" > SIDE B < /h3> <
        div className = "player-inputs" >
        <
        input type = "text"
        placeholder = "Player 1"
        value = { teamB[0] }
        onChange = {
            (e) => setTeamB([e.target.value, teamB[1]]) }
        className = "player-input" /
        > {
            matchType === 'doubles' && ( <
                input type = "text"
                placeholder = "Player 2"
                value = { teamB[1] }
                onChange = {
                    (e) => setTeamB([teamB[0], e.target.value]) }
                className = "player-input" /
                >
            )
        } <
        /div> <
        /div> <
        /div>

        <
        button className = "start-btn"
        onClick = { handleStart } >
        START MATCH <
        /button>

        <
        button className = "history-btn"
        onClick = {
            () => navigate('/history') } >
        Match History <
        /button> <
        /div>
    );
};

export default SetupScreen;