import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import '../styles/HistoryScreen.css';

const HistoryScreen = ({ matches }) => {
    const navigate = useNavigate();

    const getTeamName = (team) => team.players.join(' & ');

    return ( <
        div className = "history-container" >
        <
        div className = "history-header" >
        <
        button className = "back-btn"
        onClick = {
            () => navigate('/') } > ←Back < /button> <
        h2 > HISTORY < /h2> <
        /div>

        <
        div className = "matches-list" > {
            matches.length === 0 ? ( <
                div className = "no-matches" >
                <
                p > No matches yet < /p> <
                button className = "start-match-btn"
                onClick = {
                    () => navigate('/') } >
                Start a Match <
                /button> <
                /div>
            ) : (
                matches.map((match) => ( <
                    div key = { match.id }
                    className = "match-card" >
                    <
                    div className = "match-date" > { format(new Date(match.date), 'dd MMM, hh:mm a') } <
                    /div>

                    <
                    div className = "match-result" >
                    <
                    div className = "team-result" >
                    <
                    span className = "team-players" > { getTeamName(match.teamA) } < /span> <
                    span className = "team-score" > { match.teamA.sets.filter(s => s >= 21).length } <
                    /span> <
                    /div> <
                    div className = "team-result" >
                    <
                    span className = "team-players" > { getTeamName(match.teamB) } < /span> <
                    span className = "team-score" > { match.teamB.sets.filter(s => s >= 21).length } <
                    /span> <
                    /div> <
                    /div>

                    <
                    div className = "match-sets" > {
                        match.teamA.sets.map((score, idx) => ( <
                            span key = { idx }
                            className = "set-detail" > { score } - { match.teamB.sets[idx] } <
                            /span>
                        ))
                    } <
                    /div> <
                    /div>
                ))
            )
        } <
        /div> <
        /div>
    );
};

export default HistoryScreen;