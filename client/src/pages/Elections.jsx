import React, { useEffect, useState} from "react";
//import { elections as dummyElections } from "../data";
import Election from '../components/Election'
import AddElectionModal from "../components/AddElectionModal";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import UpdateElectionModal from "../components/UpdateElectionModal";
import axios from "axios"
import Loader from '../components/loader'
import { useNavigate } from "react-router-dom";

const Elections = () => {
    
const navigate = useNavigate()
const token = useSelector(state => state?.vote?.currentVoter?.token)
    //access control

    useEffect(() => {
        if(!token) {
            navigate('/')
        }
    }, [])

    const [elections, setElections] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    


     const dispatch = useDispatch()

    //open election modal
    
    const openModal = () =>{

        dispatch(uiActions.openElectionModal())
    }
   
    const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin)
    const electionModalShowing = useSelector(state => state.ui.electionModalShowing)
    const updateElectionModalShowing = useSelector(state => state.ui.updateElectionModalShowing)


    const getElections = async () => {
          setIsLoading(true)
          setError(null)
        try{
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections`, {withCredentials: true,
            headers: {Authorization: `Bearer ${token}`}})
            console.log("Elections fetched:", response.data)
            setElections(response.data)

        } catch(error) {
            console.error("Error fetching elections:", error)
            setError("Failed to load elections. Please try again later.")
        }
        setIsLoading(false)
    }

    useEffect(() => {

       getElections()


    }, [])


    return(
      <>
        <section className="elections">
            <div className="container elections_container">
                <header className="elections_header">
                    <h1>Ongoing Elections</h1>
                    {isAdmin && <button className="btn primary" onClick={openModal}>Create New Elections</button>}
                </header>
               {isLoading ? <Loader /> : <menu className="elections_menu">
                    {
                        elections.map(election => <Election key = {election._id}{...election} />)
                    }
                </menu>}
            </div>
        </section>
        {electionModalShowing && <AddElectionModal />}
        {updateElectionModalShowing && < UpdateElectionModal/>}
      </>

    )
}
export default Elections