import React from 'react'
import { IoMdTrash } from 'react-icons/io'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ElectionCandidate = ({ fullName, image, motto, _id: id }) => {
  const navigate = useNavigate()
  const token = useSelector(state => state?.vote?.currentVoter?.token)

  const deleteCandidate = async () => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/candidates/${id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      alert("Candidate deleted successfully.");
      navigate(0)
    } catch (error) {
      console.log(error)
      alert("Failed to delete candidate. Please try again.");
    }
  }
  return (
    <li className='electionCandidate'>
      <div className='electionCandidate_image'>
        <img src={image} alt={fullName} />
      </div>
      <div>
        <h5>{fullName}</h5>
        <small>{motto?.length > 70 ? motto.substring(0, 70) + "..." : motto}</small>
        <button className='electionCandidate_btn' onClick={deleteCandidate}><IoMdTrash /></button>
      </div>
    </li>
  )
}

export default ElectionCandidate