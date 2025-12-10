import React, { useEffect, useState } from "react";
//import { candidates as dummyCandidates } from "../data"
import { useNavigate, useParams } from "react-router-dom";
import Candidate from "../components/Candidate";
import ConfirmVote from "../components/ConfirmVote";
import { useSelector } from "react-redux";
import axios from 'axios'


const Candidates = () => {
        const token = useSelector(state => state?.vote?.currentVoter?.token)
        const navigate = useNavigate()

        // access control

        useEffect (() => {

            if(!token) {

                navigate('/')
            }
        }, [])

    const {id: selectedElection}= useParams()
    const [candidates, setCandidates] = useState([])
    const [canVote, setCanVote] = useState(true)

    const voteCandidateModalShowing = useSelector(state => state.ui.voteCandidateModalShowing)


    const voterId = useSelector(state => state?.vote?.currentVoter?.id)
    const votedElections = useSelector(state => state?.vote?.currentVoter?.votedElections)

    const getCandidates = async () => {
        try {

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${selectedElection}/candidates`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
            setCandidates(response.data)

        } catch (error) {
            console.log(error)
        }
    }


   // const Candidates = dummyCandidates.filter(candidate => candidate.election === id)



   // check if voter already voted

    const getVoter = async () => {
    try{
        // First check if we have votedElections in Redux store
        if (votedElections && votedElections.length > 0) {
            const votedElectionIds = votedElections.map(election => election._id ? election._id : election);
            if(votedElectionIds.includes(selectedElection)) {
                setCanVote(false)
                return;
            }
        }
        
        // If not found in store or store is empty, fetch from API
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/voters/${voterId}`, {withCredentials: true, headers: {Authorization:`Bearer ${token}`}})
        const votedElectionsFromAPI = response.data.votedElections.map(election => election._id ? election._id : election);
        if(votedElectionsFromAPI.includes(selectedElection)) {
            setCanVote(false)
        } else {
            setCanVote(true)
        }
    } catch (error) {
        console.log(error)
        // If API call fails, check local storage as fallback
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.votedElections) {
            const votedElectionIds = currentUser.votedElections.map(election => election._id ? election._id : election);
            if(votedElectionIds.includes(selectedElection)) {
                setCanVote(false)
            } else {
                setCanVote(true)
            }
        }
    }
} 

useEffect (() => {
    getCandidates()
    getVoter()
   }, [selectedElection, voterId, token, votedElections])

       
    return(
        <>
        <section className="candidates">
            {!canVote ? <header className="candidates_header">
                <h1>Already Voted</h1>
                <p>You are only permitted to vote once in an election. Please vote in another election or sign out.</p>
            </header> : <> {candidates.length > 0 ? <header
            className="candidates_header">
               <h1>Vote your candidate</h1>
                <p>These are the candidates for the selected election. Please vote once and wisely, because you won't
                    be allowed to in this election again.</p>
                
            </header> : <header className="candidates_header">
                <h1>Inactive Election</h1>
                <p>There are no candidates found for this election. Please check back later.</p>
            </header>}
       
            <div className="container candidates_container">
            {
                candidates.map(candidate => <Candidate key={candidate._id} {...candidate} />)
            }
                
            </div>
            </>}

        </section>

        {voteCandidateModalShowing && <ConfirmVote selectedElection={selectedElection} />}

      </>
    )
        
}
export default Candidates
