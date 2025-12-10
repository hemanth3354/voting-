
import React, { useEffect, useState } from 'react'
// import { candidates } from '../data'
import CandidateRating from './CandidateRating'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Loader from './loader'



const ResultElection = ({_id: id, thumbnail, title}) => {
    const [totalVotes, setTotalVotes] = useState(0)
    const [electionCandidates, setElectionCandidates] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [showVoteCounts, setShowVoteCounts] = useState(false);
    const [electionStatus, setElectionStatus] = useState('pending');

    const token = useSelector(state => state?.vote?.currentVoter?.token)
    const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin)
    const navigate = useNavigate();

     /* const electionCndidates = candidates.filter(candidate => {
        return candidate.election === id
    }) */

const getCandidates = async () =>{
  setIsLoading(true)

  try {


    const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/candidates`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
    const candidates = await response.data;
    setElectionCandidates(candidates)

    // calculate the total votes in each  election

    for(let i = 0; i < candidates.length; i++) {

      setTotalVotes(prevState => prevState += candidates[i].voteCount)

    }


  } catch(error) {
    console.log(error)

  }
  setIsLoading(false)
}

const resetVotes = async () => {
  if (!window.confirm("Are you sure you want to reset all votes for this election?")) {
    return;
  }
  try {
    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/elections/${id}/reset-votes`, {}, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
    alert("Election votes reset successfully.");
    // Refresh the candidates to show updated vote counts
    getCandidates();
  } catch (error) {
    console.error("Error resetting votes:", error)
    alert("Failed to reset votes. Please try again.");
  }
}



const getElectionStatus = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
    setElectionStatus(response.data.status);
    setShowVoteCounts(response.data.showVoteCounts);
  } catch (error) {
    console.log(error);
  }
}

const toggleVoteCounts = async () => {
  try {
    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/elections/${id}/toggle-votes`, {}, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
    setShowVoteCounts(response.data.election.showVoteCounts);
  } catch (error) {
    console.log(error);
  }
}

const handleEnterElection = () => {
  if (electionStatus === 'pending') {
    alert('Election not yet started, please contact admin.');
  } else if (electionStatus === 'active') {
    navigate(`/elections/${id}/candidates`);
  } else if (electionStatus === 'inactive') {
    alert('Election not yet started. Please contact admin.');
  }
}

useEffect(() => {

    getCandidates()
    getElectionStatus()


}, [])
        
  return (
    <>

    {isLoading && <Loader />}
    <article className='result'>
        <header className='result_header'>
            <h4>{title}</h4>
            <div className='result_header-image'>
                <img src={thumbnail} alt={title} />
            </div>
       
        </header>
             <ul className='result_list'>

{
  electionCandidates.map(candidate => <CandidateRating key= {candidate.id} {...candidate} totalVotes= {totalVotes} isAdmin={isAdmin} showVoteCounts={showVoteCounts} />)
}
            </ul>   

            <button className='btn primary full' onClick={handleEnterElection}>Enter Election</button>
            {isAdmin && <button className="btn danger full" onClick={resetVotes}>Reset Votes</button>}
            {isAdmin && (
                <button
                    className={`btn ${showVoteCounts ? 'danger' : 'primary'} full`}
                    onClick={toggleVoteCounts}
                >
                    {showVoteCounts ? 'Hide Vote Counts' : 'Show Vote Counts'}
                </button>
            )}
    </article>
    </>
  )
}

export default ResultElection