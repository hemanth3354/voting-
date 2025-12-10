import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { uiActions } from '../store/ui-slice'
import { voteActions } from '../store/vote-slice'
import axios from 'axios'

const Election= ({_id: id, title, description, thumbnail, status}) =>  {

  const dispatch = useDispatch()

// open update election modal
const openModal = () => {

  dispatch(uiActions.openUpdateElectionModal())
  dispatch(voteActions.changeIdOfElectionToUpdate(id))
}

const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin)
const token = useSelector(state => state?.vote?.currentVoter?.token)

// Function to start election
const startElection = async () => {
  if (!window.confirm("Are you sure you want to start this election?")) {
    return;
  }

  try {
    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/elections/${id}/start`, {}, {
      withCredentials: true,
      headers: {Authorization: `Bearer ${token}`}
    })
    alert("Election started successfully!");
    // Refresh the page to show updated status
    window.location.reload();
  } catch (error) {
    console.error("Error starting election:", error)
    alert("Failed to start election. Please try again.");
  }
}

// Function to stop election
const stopElection = async () => {
  if (!window.confirm("Are you sure you want to stop this election? This will end voting.")) {
    return;
  }

  try {
    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/elections/${id}/stop`, {}, {
      withCredentials: true,
      headers: {Authorization: `Bearer ${token}`}
    })
    alert("Election stopped successfully!");
    // Refresh the page to show updated status
    window.location.reload();
  } catch (error) {
    console.error("Error stopping election:", error)
    alert("Failed to stop election. Please try again.");
  }
}

  return (
    <article className='election'>
        <div className='election_image'>
            <img src={thumbnail} alt={title} />
        </div>
        <div className='election_info'>
            <Link to={`/elections/${id}`}><h4>{title}</h4></Link>
            <p>{description?.length > 255 ? description.substring(0, 255) + "..." :
            description}</p>
            <div className="election_status">
                <span className={`status ${status}`}>{status}</span>
            </div>
            <div className="election_cta">
                <Link to={`/elections/${id}`} className={`btn sm ${status === 'active' ? 'primary' : 'danger'}`}>View</Link>
               {isAdmin &&  <button className="btn sm primary" onClick={openModal}>Edit</button>}
               {isAdmin && (status === 'pending' || status === 'inactive') && (
                   <button className="btn sm success" onClick={startElection}>Start</button>
               )}
               {isAdmin && status === 'active' && (
                   <button className="btn sm danger" onClick={stopElection}>Stop</button>
               )}
            </div>
        </div>
    </article>
    
  )
}

export default Election