import React from 'react';
import { Container } from '@material-ui/core';

import Navbar from './components/Navbar/Navbar.js';
import Home from './components/Home/Home.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth/Auth.js';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Container ma-width="lg">
                    <Navbar/>
                    <Routes>
                        <Route path="/" exact element={<Home />} />
                        <Route path="/auth"  element={<Auth />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </>
    )
}

export default App;