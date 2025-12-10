import React, { useEffect, useState } from 'react'
// import { candidates } from '../data'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import axios from 'axios'
import { voteActions } from '../store/vote-slice'
import { useNavigate } from 'react-router-dom'

const ConfirmVote = ({selectedElection}) => {
    const[modalCandidate, setModalCandidate] = useState({})

    const dispatch = useDispatch()
    const navigate = useNavigate()
// close confirm vote modal

    const closeCandidateModal = ()=>{
        dispatch(uiActions.closeVoteCandidateModal())

    }
    // get selected candidate id from redux store

    const selectedVoteCandidate = useSelector(state => state?.vote?.selectedVoteCandidate)
    const token = useSelector(state => state?.vote?.currentVoter?.token)
    const currentVoter = useSelector(state => state?.vote?.currentVoter)
    


//get the candidate selected to be voted for
    const fetchCandidate =  async() => {
      
            try{

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
                setModalCandidate(await response.data)


            } catch (error) {
                console.log(error)
            }
    }

    // confirm vote for selected candidate

    const confirmVote = async () =>{
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`, {selectedElection}, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})

            const voteResult = await response.data;
            const updatedVoter = {...currentVoter, votedElections: voteResult};
            dispatch(voteActions.changeCurrentVoter(updatedVoter))
            // Also update localStorage to keep it in sync
            localStorage.setItem("currentUser", JSON.stringify(updatedVoter));
            // Trigger refresh of voters list
            dispatch(voteActions.incrementVotersRefreshTrigger())
            // Close the modal before showing success message
            closeCandidateModal()
            // The vote was successful if we got here
            alert("Vote submitted successfully");
            navigate('/congrats');
        } catch (error) {
            console.log(error)
            let msg = "Failed to submit vote. Please try again.";
            if (error.response && error.response.data && error.response.data.message) {
                msg = error.response.data.message;
            } else if (error.message) {
                msg += `\n${error.message}`;
            }
            alert(msg);
        }
        closeCandidateModal()
   }

   useEffect(() => {
     fetchCandidate()


},[])


  return (
    <section className="selection modal">

        <div className="modal_content confirm_vote-content">
            <h5> Please Confirm your vote.</h5>
            <div className='confirm_vote-image'>
                <img src={modalCandidate.image} alt={modalCandidate.fullName}/>
            </div>
            <h2>{modalCandidate.fullName?.length > 17 ? modalCandidate?.fullName.substring(0, 17) + "...":
                modalCandidate?.fullName}</h2>
            <p>{modalCandidate.motto?.length > 45 ? modalCandidate.motto.substring(0, 45) + "...":
                modalCandidate?.motto}</p>
            <div className="confirm_vote-cta">
                <button className='btn' onClick={closeCandidateModal}>Cancel</button>
                <button className='btn primary' onClick={confirmVote}>Confirm</button>   
            </div>


        </div>

    </section>
  )
}

export default ConfirmVote