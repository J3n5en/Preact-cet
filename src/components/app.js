import { h, Component } from 'preact';
import { Router } from 'preact-router';
// import {Tabs, WhiteSpace, WingBlank, Badge, SegmentedControl } from 'antd-mobile';
// import Header from './header';
import Home from './home';
import Result from './result';
// import Profile from './profile';
export default class App extends Component {
	handleRoute = e => {
		this.currentUrl = e.url;
	};
	state = {
		score: null
	}
	setScore = (score) =>{
		this.setState({score});
	}
	// onValueChange = e =>{
	// 	route('/profile');
	// 	// this.currentUrl = '/profile/'+e;
	// }
	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Home path="/forget"  isForget={true}/>
					<Result path="/result" />
					{/* <Home path="/asd" /> */}
					{/* <Profile path="/profile/" user="me" /> */}
					
					{/* <Home path="/asd" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/J3n5en" user="J3n5en" />
					<Profile path="/profile/:user" /> */}
				</Router>
			</div>
		);
	}
}
