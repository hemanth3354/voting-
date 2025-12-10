import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from '../components/loader';
import { useNavigate } from "react-router-dom";

const TotalRegisteredVoters = () => {
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
    const [selectedVoters, setSelectedVoters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    // Filter voters based on status
    const filteredVoters = voters.filter(voter => {
        if (filterStatus === 'all') return true;
        // Consider 'Voted' if status or votingStatus is 'voted' (case-insensitive)
        if (filterStatus === 'registered') {
            return (
                (voter.status && voter.status.toLowerCase() === 'voted') ||
                (voter.votingStatus && voter.votingStatus.toLowerCase() === 'voted')
            );
        }
        // Consider 'Not Yet Voted' if status or votingStatus is not 'voted'
        if (filterStatus === 'not-registered') {
            return !((voter.status && voter.status.toLowerCase() === 'voted') ||
                (voter.votingStatus && voter.votingStatus.toLowerCase() === 'voted'));
        }
        return true;
    });

    const getVoters = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/voters/registered`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
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

    const handleSelectAll = () => {
        if (selectedVoters.length === voters.length) {
            setSelectedVoters([]);
        } else {
            setSelectedVoters(voters.map(v => v._id));
        }
    };

    const handleSelectVoter = (id) => {
        setSelectedVoters(prev =>
            prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedVoters.length === 0) {
            alert("Please select voters to delete.");
            return;
        }
        if (!window.confirm(`Are you sure you want to delete ${selectedVoters.length} voter(s)?`)) {
            return;
        }
        try {
            await Promise.all(selectedVoters.map(id =>
                axios.delete(`${process.env.REACT_APP_API_URL}/voters/${id}`, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                })
            ));
            alert("Selected voters deleted successfully.");
            setSelectedVoters([]);
            getVoters(); // Refresh list
        } catch (error) {
            console.error("Error deleting voters:", error);
            alert("Failed to delete some voters. Please try again.");
        }
    };

    const handleDeleteVoter = async (id) => {
        if (!window.confirm("Are you sure you want to delete this voter?")) {
            return;
        }
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/voters/${id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Voter deleted successfully.");
            getVoters(); // Refresh list
        } catch (error) {
            console.error("Error deleting voter:", error);
            alert("Failed to delete voter. Please try again.");
        }
    };

    return (
        <section className="total-registered-voters">
            <div className="container total-registered-voters_container">
                <header className="total-registered-voters_header">
                    <h1>Total Registered Voters</h1>
                    {selectedVoters.length > 0 && (
                        <button className="btn btn-delete" onClick={handleDeleteSelected}>
                            Delete Selected ({selectedVoters.length})
                        </button>
                    )}
                </header>
                <div className="filter-container" style={{ marginBottom: '20px' }}>
                    <label htmlFor="statusFilter">Filter by Status: </label>
                    <select
                        id="statusFilter"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">ALL</option>
                        <option value="registered">Voted</option>
                        <option value="not-registered">Not Yet Voted</option>
                    </select>
                </div>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div style={{ marginTop: '30px' }}>
                        <table className="voters_table">
                            <thead>
                                <tr>
                                    <th>Serial No</th>
                                    <th>Full Name</th>
                                    <th>Voter ID</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>
                                        Actions<br />
                                        <input
                                            type="checkbox"
                                            checked={selectedVoters.length === filteredVoters.length && filteredVoters.length > 0}
                                            onChange={handleSelectAll}
                                        /> Select All
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVoters.length === 0 ? (
                                    <tr><td colSpan="6">No voters found.</td></tr>
                                ) : (
                                    filteredVoters.map((voter, index) => (
                                        <tr key={voter._id}>
                                            <td>{index + 1}</td>
                                            <td>{voter.fullName}</td>
                                            <td>{voter.voterId}</td>
                                            <td>{voter.email}</td>
<td>{voter.status || voter.votingStatus || "not yet voted"}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedVoters.includes(voter._id)}
                                                    onChange={() => handleSelectVoter(voter._id)}
                                                />
                                                <button className="btn-delete" onClick={() => handleDeleteVoter(voter._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TotalRegisteredVoters;
