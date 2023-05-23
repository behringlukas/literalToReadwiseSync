import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

function Credentials() {

    const navigate = useNavigate();

    return (
        <div className='popup'>
            <div>
                <h1>Let's get started by securily connecting your accounts.</h1>
            </div>
            <div className='syncFrom'>
                <label>Sync books from</label>
                <input type="text" name="lithandle" placeholder="Enter your Literal handle" />
            </div>
            <div className='syncTo'>
                <div className='toAndLink'>
                    <label>to</label>
                    {/*target needed to open link in new tab, will cause the popup to close*/}
                    <a href="https://readwise.io/access_token" target="_blank">Click here and login to get your token</a> 
                </div>
                <input type="password" name="readwisetoken" placeholder="Paste your Readwise access token" />
            </div>
            <div>
                <button onClick={()=>navigate('/syncList')}>Save & Continue</button>
                <p className='hint'>A hint how data is stored will be displayed here</p>
            </div>
        </div>
    );
}

export default Credentials;