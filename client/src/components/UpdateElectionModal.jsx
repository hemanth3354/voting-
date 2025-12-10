import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UpdateElectiomModal = () => {


    const [electionId, setElectionId]= useState("")
    const [title, setTitle]= useState("")
     const [description, setDescription]= useState("")
      const [thumbnail, setThumbnail]= useState("")


    const dispatch = useDispatch()
    const idOfElectionToUpdate = useSelector(state => state?.vote?.idOfElectionToUpdate)
     const token = useSelector(state => state?.vote?.currentVoter?.token)

     const navigate = useNavigate()

     console.log(idOfElectionToUpdate)
      //close update election modal 
      const closeModal = () =>{

        dispatch(uiActions.closeUpdateElectionModal())

      }

      const fetchElection = async () => {

        try{
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
          const election = await response.data
          console.log(election)
          setElectionId(election.electionId)
          setTitle(election.title)
          setDescription(election.description)


        } catch (error) {

          console.log(error)
        }
      }




      useEffect(() => {


        fetchElection()
      }, [])


      const [isLoading, setIsLoading] = useState(false);
      const updateElection = async (e) => {
        e.preventDefault()
        setIsLoading(true);
        try{
          const electionData = new FormData();
          electionData.set('electionId', electionId)
          electionData.set('title', title)
          electionData.set('description', description)
          if (thumbnail) {
            electionData.set('thumbnail', thumbnail);
          }
          const response = await axios.patch(`${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`, electionData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
          alert("Election updated successfully.")
          closeModal()
          window.location.reload(); // Force reload to fetch updated data
        } catch (error) {
          console.log(error)
          alert("Failed to update election. Please try again.")
        }
        setIsLoading(false);
      }

  return (
    <section className='modal'>
        <div className='modal_content'>
            <header className='modal_header'>
                <h4>Edit Election</h4>
                <button className='modal_close' onClick={closeModal}><IoMdClose /></button>
            </header>
            <form onSubmit={updateElection}>
                <div>
                    <h6>Election ID :</h6>
                    <input type='text'  value={electionId} onChange={e => setElectionId(e.target.value)} name='electionId' />
                </div>
                <div>
                    <h6>Election Title :</h6>
                    <input type='text'  value={ title} onChange={e => setTitle(e.target.value)} name='title' />
                </div>
                  <div>
                    <h6>Election Description :</h6>
                    <input type='text' value={description} name='description' onChange={e => setDescription(e.target.value)} />
                </div>
                        <div>
                    <h6>Election Thumbnail :</h6>
                    <input type='file' name='thumbnail' accept='png, jpg, jpeg, webp, avif' onChange={e => setThumbnail(e.target.files[0])} />
                </div>
                
                
                <button type='submit' className='btn primary' disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Election'}
                </button>
            </form>
        </div>
    </section>
  )
}

export default UpdateElectiomModal