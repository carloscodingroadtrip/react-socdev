import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar.js';
import Footer from './components/layout/Footer.js';
import Landing from './components/layout/Landing.js';
class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Navbar />
					<Route exact path="" component={Landing} />
					<h1>MY react app</h1>
					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;
