import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Profile',
      accessor: 'profilePicture',
      Cell: (props) => (
        <img
          src={props.value}
          alt="Profile"
          style={{ width: '30px', borderRadius: '50%' }}
        />
      ),
    },
   
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Country',
      accessor: 'country',
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: (props) => (
        <button onClick={() => handleDelete(props.value)}>Delete</button>
      ),
    },
  ];

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`);
      setData((prevData) => prevData.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === 'string' &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="App">
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        <div className="header-container">
          <h2 className="table-heading">List of Users</h2>
          <input 
          className='global-search-input'
            type="text"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Global Search"
          />
          </div>
          <ReactTable
            data={filteredData}
            columns={columns}
            defaultPageSize={5}
            className="-striped -highlight"
          />
          
        </>
      )}
    </div>
  );
};

export default App;
