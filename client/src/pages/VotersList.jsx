import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from '../components/loader';
import { useNavigate } from "react-router-dom";

const VotersList = () => {
    const navigate = useNavigate();
    const token = useSelector(state => state?.vote?.currentVoter?.token);
    const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin);

    // Access control
    useEffect(() => {
        if (!token || !isAdmin) {
            navigate('/');
        }
    }, [token, isAdmin]);

    const [voters, setVoters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newVoter, setNewVoter] = useState({ fullName: '', email: '', mobile: '', voterId: '' });
    const [editingVoterId, setEditingVoterId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const getVoters = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("API URL:", `${process.env.REACT_APP_API_URL}/voters`);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/voters`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Voters fetched:", response.data);
            setVoters(response.data);
        } catch (error) {
            console.error("Error fetching voters:", error);
            setError("Failed to load voters. Please try again later.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getVoters();
    }, []);

    const handleAcceptVoter = async (e, voterId) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const accepted = formData.get('accept') === 'on';
        if (!accepted) {
            alert('Please check the accept box before submitting.');
            return;
        }
        // Placeholder for accepting voter - implement API call here
        alert(`Voter ${voterId} accepted by admin.`);
        // TODO: Implement API call to accept voter
    };

    const handleAddVoter = async (e) => {
        e.preventDefault();
        try {
            if (editingVoterId) {
                // Update existing voter
                const response = await axios.patch(`${process.env.REACT_APP_API_URL}/voters/${editingVoterId}`, newVoter, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Voter updated successfully.');
            } else {
                // Add new voter
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/voters/add`, newVoter, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Voter added successfully.');
            }
            setNewVoter({ fullName: '', email: '', mobile: '', voterId: '' });
            setEditingVoterId(null);
            getVoters(); // Refresh the list
        } catch (error) {
            console.error('Error adding/updating voter:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Failed to add/update voter: ${error.response.data.message}`);
            } else {
                alert('Failed to add/update voter.');
            }
        }
    };

    const handleEdit = (voterId) => {
        const voter = voters.find(v => v._id === voterId);
        if (voter) {
            setNewVoter({ fullName: voter.fullName, email: voter.email, mobile: voter.mobile || '', voterId: voter.voterId || '' });
            setEditingVoterId(voterId);
        }
    };

    const handleDelete = async (voterId) => {
        if (window.confirm('Are you sure you want to delete this voter?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/voters/${voterId}`, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Voter deleted successfully.');
                getVoters(); // Refresh the list
            } catch (error) {
                console.error('Error deleting voter:', error);
                alert('Failed to delete voter.');
            }
        }
    };

    const handleCancelEdit = () => {
        setNewVoter({ fullName: '', email: '', mobile: '', voterId: '' });
        setEditingVoterId(null);
    };

    // Filter voters based on status
    const filteredVoters = voters.filter(voter => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'registered') return voter.status && voter.status !== 'Not Registered';
        if (filterStatus === 'not-registered') return !voter.status || voter.status === 'Not Registered';
        return true;
    });

    return (
        <section className="voters">
            <div className="container voters_container">
                <header className="voters_header">
                    <h1>Voters List</h1>
                </header>
                <form onSubmit={handleAddVoter} className="add-voter-form">
                    <h3>{editingVoterId ? 'Edit Voter' : 'Add New Voter'}</h3>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={newVoter.fullName}
                        onChange={(e) => setNewVoter({ ...newVoter, fullName: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newVoter.email}
                        onChange={(e) => setNewVoter({ ...newVoter, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Mobile"
                        value={newVoter.mobile}
                        onChange={(e) => setNewVoter({ ...newVoter, mobile: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Voter ID"
                        value={newVoter.voterId}
                        onChange={(e) => setNewVoter({ ...newVoter, voterId: e.target.value })}
                        required
                    />
                    <button type="submit">{editingVoterId ? 'Update Voter' : 'Add Voter'}</button>
                    {editingVoterId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
                </form>
                <div className="filter-container">
                    <label htmlFor="statusFilter">Filter by Status: </label>
                    <select
                        id="statusFilter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All</option>
                        <option value="registered">Registered</option>
                        <option value="not-registered">Not Registered</option>
                    </select>
                </div>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <table id="voterslist" className="voters_table">
                        <thead>
                            <tr>
                                <th>Serial No</th>
                                <th>Full Name</th>
                                <th>Voter ID</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVoters.length === 0 ? (
                                <tr><td colSpan="7">No voters found.</td></tr>
                            ) : (
                                filteredVoters.map((voter, index) => (
                                    <tr key={voter._id}>
                                        <td>{index + 1}</td>
                                        <td>{voter.fullName}</td>
                                <td>{voter.voterId}</td>
                                        <td>{voter.email}</td>
                                        <td>{voter.mobile || ""}</td>
                                        <td>{voter.status || "Not Registered"}</td>
                                        <td>
                                            <button className="btn btn-edit" onClick={() => handleEdit(voter._id)}>Edit</button>
                                            <button className="btn btn-delete" onClick={() => handleDelete(voter._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
};

export default VotersList;
