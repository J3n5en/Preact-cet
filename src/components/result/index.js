import { h } from 'preact';
import React from 'react';
import { route } from 'preact-router';
// import { Link } from 'preact-router';
import style from './style.less';
import Header from '../header';
import { Flex, WhiteSpace,Toast } from 'antd-mobile';
let ctx;
let radius = 450;
let lineWidth = 80;
let fontSize = 150;
let circleX = 500;
let circleY = 500;

function circle(cx, cy, r) {
	// 画圆
	ctx.beginPath();
	ctx.moveTo(cx + r, cy);
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = '#eee';
	ctx.arc(cx, cy, r, 0, Math.PI * 2);
	ctx.closePath();
	ctx.stroke();
}
function sector(cx, cy, r, startAngle, endAngle, anti) {
	// 弧线
	ctx.beginPath();
	ctx.moveTo(cx, cy + r); // 从圆形底部开始画
	ctx.lineWidth = lineWidth;

	// 渐变色 - 可自定义
	const linGrad = ctx.createLinearGradient(
		circleX, circleY - radius - lineWidth, circleX, circleY + radius + lineWidth
	);
	linGrad.addColorStop(0.0, '#ec847a');
	linGrad.addColorStop(0.5, '#9bc4eb');
	linGrad.addColorStop(1.0, '#eccd23');
	ctx.strokeStyle = linGrad;
	// 圆弧两端的样式
	ctx.lineCap = 'round';
	// 圆弧
	ctx.arc(
		cx, cy, r,
		startAngle * (Math.PI / 180.0) + (Math.PI / 2),
		endAngle * (Math.PI / 180.0) + (Math.PI / 2),
		anti
	);
	ctx.stroke();
}
export default class Result extends React.Component {
	state = {
		score:'null'
	}
	componentWillMount(){
		if (sessionStorage.getItem('score')){
			// route('/');
		} else {
			let score = {
				id:"440530171211112",
				listen: "105",
				name:"吴梓轩",
				read:"164",
				school:"韶关学院",
				score:"389",
				talk:"0",
				type:"2",
				write:"120"
			};
			// this.setState({score:JSON.parse(sessionStorage.getItem('score'))});
			this.setState({score});
			// sessionStorage.clear();
		}
	}
	componentDidMount() {
		console.log();
		let canvas = document.querySelector('#percent');
		ctx = canvas.getContext("2d");
		let score = this.state.score.score;
		if (score >= 425) {
			Toast.success('666!!!过了,快点右上角分享到朋友圈装逼吧!!', 3);
		}
		ctx.clearRect(0, 0, circleX * 2, circleY * 2);
		ctx.font = fontSize + 'px April';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = '#999';
		ctx.fillText(score, circleX, circleY);
		circle(circleX, circleY, radius);
		sector(circleX, circleY, radius, 0, score / 710 * 360);
		// console.log(sessionStorage.getItem('score'));
		sessionStorage.clear();
	}
	render({},{score}) {
		return (
			<div class={style.flexcontainer}>
				<Header />
				<Flex direction="column" style={{overflow:'hidden'}}>
					<Flex.Item style={{width:'100%',textAlign: 'center'}}>
						<canvas id="percent" width="1000" className={style.canvas} height="1000">
							<p>抱歉，您的浏览器不支持canvas</p>
						</canvas>
						<p style={{marginBottom: '10px'}}>{score.name}</p>
						<i class={style.nameline} />
						<p style={{marginBottom: '10px'}}>{score.type==='1'?'英语四级':'英语六级'}</p>
						<i class={style.typeline} />
						<p style={{margin: '20px 0 10px 0'}}>{score.school}</p>
						<i class={style.schoolline} />
						<p style={{margin: '20px 0 10px 0'}}>{score.id}</p>
						<i class={style.ticketline} />
					</Flex.Item>
					<Flex.Item style={{width:'100%'}}>
						<Flex>
							<Flex.Item>
								<div class={style.score}>
									<i>听力</i>
									<em>{score.listen}</em>
								</div>
							</Flex.Item>
							<i class={style.line} />
							<Flex.Item>
								<div class={style.score}>
									<i>阅读理解</i>
									<em>{score.read}</em>
								</div>
							</Flex.Item>
						</Flex>
						<Flex>
							<Flex.Item>
								<i class={style.line2} />
							</Flex.Item>
							<Flex.Item>
								<i class={style.line2} />
							</Flex.Item>
						</Flex>
						{/* <i class={style.line2} /> */}
						{/* <i class={style.line3} /> */}
						<Flex>
							<Flex.Item>
								<div class={style.score}>
									<i>写作和翻译</i>
									<em>{score.write}</em>
								</div>
							</Flex.Item>
							<i class={style.line} />
							<Flex.Item>
								<div class={style.score}>
									<i>口语成绩</i>
									<em>{score.talk}</em>
								</div>
							</Flex.Item>
						</Flex>
					</Flex.Item>
				</Flex>
				<WhiteSpace size="xl"/>
				<WhiteSpace size="xl"/>
			</div>
		);
	}
}
