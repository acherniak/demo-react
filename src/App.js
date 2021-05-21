import React, { useState, useEffect } from 'react';
import './App.css';
import Toolbar from './ButtonAppBar';
//import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
//import { PhotoCamera } from '@material-ui/icons';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 2 },
	{ field: 'dob', headerName: 'DoB', flex: 1, valueFormatter: p => new Date(p.value).toLocaleDateString() },
  { field: 'adr', headerName: 'Street Address', flex: 2 },
	{ field: 'city', headerName: 'Town', flex: 1 },
	{ field: 'state', headerName: 'State', flex: 1 },
	{ field: 'email', headerName: 'Email', flex: 2 },
	{ field: 'phone', headerName: 'Phone', flex: 2 },
];

function App() {
	const [rows, setRows] = useState([]),
		act = (ev) => { switch (ev) {
				case 'refr': fetch('/staff').then(res => res.json()).then(res => setRows(res.map(p=>({ id: p._id, name: p.name, dob: p.dob, ...p.custom}))))
					.catch(err => console.log(err)); break;
				default: break;
			}
		}

	useEffect(() => { act('refr'); }, []);
	
  return (
    <div>
			<Toolbar onAct={act}/>
			<DataGrid rows={rows} columns={columns} autoHeight pageSize={5} rowsPerPageOptions={[5, 10, 20, 50, 100]}/>
    </div>
  );
}

export default App;
