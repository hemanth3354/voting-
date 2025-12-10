const {Router} = require("express")

const {addVoter, registerVoter,loginVoter, getVoter, getVoters, getVotersCount, deleteVoter, updateVoter} = require('../controllers/voterController')

const {addElection, getElections, getElection, removeElection, updateElection, getCandidatesOfElection, getElectionVoters, resetElectionVotes, startElection, stopElection, toggleShowVoteCounts} = require('../controllers/electionController')

 const {addCandidate, getCandidate, removeCandidate, voteCandidate} = require('../controllers/candidateController')
 

const authMiddleware = require('../middleware/authMiddleware')
const router = Router()

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});


router.post('/voters/register', registerVoter);
router.post('/voters/login', loginVoter);
router.post('/voters/add', authMiddleware, addVoter);
router.get('/voters/registered', authMiddleware, require('../controllers/voterController').getRegisteredVoters);
router.get('/voters', authMiddleware, getVoters);
router.get('/voters/count', authMiddleware, getVotersCount);
router.get('/voters/:id',authMiddleware, getVoter);
router.patch('/voters/:id', authMiddleware, updateVoter);
router.delete('/voters/:id', authMiddleware, deleteVoter);




router.post('/elections', authMiddleware, addElection)
router.get('/elections', authMiddleware, getElections);
router.get('/elections/:id', authMiddleware, getElection);
router.delete('/elections/:id',authMiddleware, removeElection);
router.patch('/elections/:id', authMiddleware, updateElection);
router.get('/elections/:id/candidates', authMiddleware, getCandidatesOfElection);
router.get('/elections/:id/voters', authMiddleware, getElectionVoters);
router.patch('/elections/:id/reset-votes', authMiddleware, resetElectionVotes);
router.patch('/elections/:id/start', authMiddleware, startElection);
router.patch('/elections/:id/stop', authMiddleware, stopElection);
router.patch('/elections/:id/toggle-votes', authMiddleware, toggleShowVoteCounts);


router.post('/candidates', authMiddleware, addCandidate);
router.get('/candidates/:id', authMiddleware, getCandidate);
router.delete('/candidates/:id',authMiddleware, removeCandidate);
router.patch('/candidates/:id', authMiddleware, voteCandidate); 


module.exports = router
