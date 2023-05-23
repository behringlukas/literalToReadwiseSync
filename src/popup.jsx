import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';

import Credentials from './credentials.jsx';
import SyncList from './syncList.jsx';

function Popup() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Credentials />} />
                <Route path="/syncList" element={<SyncList />} />
                <Route path="*" element={<Navigate to="/" />} /> 
            </Routes>
        </Router>
    );
}

render(<Popup />, document.getElementById('react-target')); //renders component inside the div with id 'react-target'