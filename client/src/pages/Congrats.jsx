import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'

const Congrats = () => {

const token = useSelector(state => state?.vote?.currentVoter?.token)
const navigate = useNavigate()
    //access control
       useEffect(() => {
    
                if(!token) {
    
                    navigate('/')
                }
            }, [])
    return(
        <section className="congrats">

            <div className="container congrats_container">
                <h2>Thanks for your vote!</h2>
                <h3>The Results Will be Announced Very Soon</h3>
                <p>Your vote is now added to your  candidates vote count.
                     You will be redirected shortly to see the new result.</p>
                     <Link to='/results' className='btn sm primary'>See Results</Link>
            </div>
        </section>
    )
}
export default Congrats