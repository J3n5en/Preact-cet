import { h, Component } from 'preact';
// import { Link } from 'preact-router';
import style from './style.less';
import { WhiteSpace } from 'antd-mobile';
export default class Header extends Component {
	render() {
		return (
			<header>
				<WhiteSpace size="lg"/>
				<WhiteSpace size="lg"/>
				<div className={style.logo}>CET</div>
				<WhiteSpace size="lg"/>
				<i className={style.subLogo}>
					四六级成绩查询神器
				</i>
				<WhiteSpace size="lg"/>
				<WhiteSpace size="lg"/>
			</header>
		);
	}
}
