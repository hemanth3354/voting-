import React, { useEffect, useState }  from "react";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ElectionCandidate from '../components/ElectionCandidate'
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import AddCandidateModal from "../components/AddCandidateModal";
import axios from 'axios'
import { voteActions } from "../store/vote-slice";

const ElectionDetails = () => {

    
        //access control
           useEffect (() => {
        
                    if(!token) {
        
                        navigate('/')
                    }
                }, [])


    const [isLoading, setIsLoading] = useState(false)
    const [election, setElection] = useState({})
    const [candidates, setCandidates] = useState([])
    const [voters, setVoters] = useState([])
    
    const navigate = useNavigate()

    const { id } = useParams()
    const dispatch = useDispatch()

    const addCandidateModalShowing = useSelector(state => state.ui.addCandidateModalShowing)
    const token = useSelector(state => state?.vote?.currentVoter?.token)
    const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin)
    const votersRefreshTrigger = useSelector(state => state?.vote?.votersRefreshTrigger)

    const getElectionAndCandidates = async () => {
        setIsLoading(true)
        try {
            // Get election details
            const electionResponse = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            })
            setElection(electionResponse.data)
            
            // Get candidates for this election
            const candidatesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/candidates`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            })
            setCandidates(candidatesResponse.data)
        } catch (error) {
            console.error("Error fetching election details:", error)
        }
        setIsLoading(false)
    }

    const getVoters = async () => {

    try{
         const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/voters`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }})

          setVoters(response.data)



    } catch(error) {
        console.log(error)

   }

    }
    const deleteElection = async () => {
        if (!window.confirm("Are you sure you want to delete this election?")) {
            return;
        }
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/elections/${id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
            alert("Election deleted successfully.");
            navigate('/elections')
        } catch (error) {
            console.log(error)
            alert("Failed to delete election. Please try again.");
        }
    }


    useEffect(() => {
        getElectionAndCandidates()
        if(isAdmin) getVoters()
    }, [id, isAdmin])

    // Refresh voters list when trigger changes
    useEffect(() => {
        if (votersRefreshTrigger > 0 && isAdmin) {
            getVoters()
        }
    }, [votersRefreshTrigger, isAdmin])

    // open add candidate modal
    const openModal = () => {
        dispatch(uiActions.openAddCandidateModal())
        dispatch(voteActions.changeAddCandidateElectionId(id))
    }


    return(
        <>
        <section className="electionDetails">
            <div className="container electionDetails_container">
                <h2>{election.title} (ID: {election.electionId})</h2>
                <p>{election.description}</p>
                <div className="electionDetails_image">
                    <img src={election.thumbnail} alt={election.title}/>
                </div>

                <menu className="electionDetails_candidates">
                    {candidates.map(candidate => (
                        <ElectionCandidate key={candidate._id} {...candidate} />
                    ))}
                  { isAdmin &&  <button className="add_candidate-btn" onClick={openModal}><IoAddOutline /></button>}
                </menu>

                {isAdmin && <menu className="voters">
                    <h2>Voters</h2>
                    <table className="voters_table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Full Name</th>
                                <th>Voter ID</th>
                                <th>Email Address</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                voters.map((voter, index) => <tr key={voter._id}>
                                    <td>{index + 1}</td>
                                    <td><h5>{voter.fullName}</h5></td>
                                    <td>{voter.voterId}</td>
                                    <td>{voter.email}</td>
                                    <td>{new Date(voter.createdAt).toLocaleString()}</td>
                                </tr>)

                            }
                        </tbody>
                    </table>
                </menu>}

                {isAdmin &&<button className="btn danger full" onClick={deleteElection}>Delete Election</button>}
            </div>
        </section>
        {addCandidateModalShowing && <AddCandidateModal/>}
        </>
    )
}

export default ElectionDetails
