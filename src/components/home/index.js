import { h, Component } from 'preact';
import style from './style.less';
import { WingBlank,
	WhiteSpace,
	SegmentedControl,
	InputItem,
	ActivityIndicator,
	Flex,
	List,
	Modal,
	Toast,
	Radio,
	Button
} from 'antd-mobile';
import Header from '../header';
import { Router, route } from 'preact-router';
// import Form from '../profile/index.jsx';
const RadioItem = Radio.RadioItem;
const provinceList = {"青海":63,"辽宁":21,"贵州":52,"北京":11,"广西":45,"广东":44,"上海":31,"海南":46,"甘肃":62,"山东":37,"江西":36,"宁夏":64,"福建":35,"河北":13,"西藏":54,"吉林":22,"黑龙江":23,"湖南":43,"天津":12,"内蒙古":15,"安徽":34,"陕西":61,"山西":14,"新疆":65,"四川":51,"重庆":50,"湖北":42,"江苏":32,"河南":41,"浙江":33,"云南":53};
const segVale = ['有准考证通道', '无准考证通道'];
let ws;
export default class Home extends Component {
	onChange = (e) => {
		const routerValue = ['/', '/forget'];
		route(routerValue[e.nativeEvent.selectedSegmentIndex]);
	}

	state = {
		waitting:false,
		name:null,
		ticket:null,
		errorId:false,
		people:null,
		province:null,
		isConn: false,
		school:null,
		isCet6:false
	}
	nomalMode() {
		return (
			<div className="forger-mode">
				<InputItem className={style.inputbox}
					name="ticket"
					value={this.state.ticket}
					type="number"
					clear={true}
					onChange={v=>this.setState({ticket:v})}				
					placeholder="准考证号"
				/>
			</div>
		);
	}
	getScoreByName = () => {
		const self = this;
		Toast.loading('连接中...');
		ws= new WebSocket("ws://46.zeffee.com:8080/checkByName");
		ws.onopen = function(){
			// Toast.hide();
			self.setState({isConn:true});
			// console.log(evn);
			ws.send(JSON.stringify({
				"cetType":self.isCet6?2:1,
				"name":self.state.name,
				"proviceCode":provinceList[self.state.province],
				"school":self.state.school
			}));
		};
		ws.onmessage = function(evn){
			Toast.hide();
			if (isNaN(evn.data)){
				ws.send('cancel');
				// console.log(evn.data==='null'||evn.data==='idError');
				if (evn.data==='null'){
					//找不到
				} else if (evn.data==='idError'){
					self.setState({errorId:'服务器出现了点问题~请重试!',waitting:false});
				} else {
					// 取到的是有效结果
					sessionStorage.setItem('score', evn.data);
					route('/result');
				}
			} else {
				console.log('取到排队人数...');
				if (self.state.isConn){
					self.setState({
						waitting:true,
						people:evn.data
					});
					setTimeout(()=>{
						ws.send('getResult');
					}, 3000);
				}
			}
		};
	}
	cancel = () =>{
		this.setState({
			waitting:false,
			isConn:false
		});
		ws.send('cancel');
	}
	submitHandler = () => {
		if (this.props.isForget){
			this.getScoreByName(); // 丢失模式
		} else {
			this.getScoreByTicket(); // 正常模式
		}
		// console.log(provinceList[this.state.province],this.state.school,this.state.name,this.state.isCet6);
	}
	getScoreByTicket(){
		// let score = {"id":"440530162213802","listen":"","name":"","read":"","school":"","score":"","talk":"","type":"","write":""};
		// this.props.setScore({"id":"440530162213802","listen":"","name":"","read":"","school":"","score":"","talk":"","type":"","write":""})
		// sessionStorage.setItem('score', JSON.stringify(score));
		route('/result');
		fetch("http://46.zeffee.com:8080/getResultByID?id=${}&name=${}")
			.then(response => {response.text();})
			.then((resp)=>{
				if (resp.data==='null'){
					//找不到
				} else if (resp.data==='idError'){
					this.setState({errorId:'服务器出现了点问题~请重试!',waitting:false});
				} else {
					// 取到的是有效结果
					sessionStorage.setItem('score', resp.data);
					route('/result');
				}
			})
			.catch((err) =>{
				this.setState({errorId:'服务器出现了点问题~请重试!',waitting:false});				
			});
	}
	forgetMode(){
		return (
			<div className="forger-mode">
				<InputItem className={style.inputbox}
					name='province'
					clear={true}
					error={this.state.province&&!provinceList[this.state.province]}
					value={this.state.province}
					onChange={v=>this.setState({province:v})}					
					placeholder="省份 如:广东"
				/>
				<WhiteSpace size="lg" />
				<InputItem className={style.inputbox}
					province="school"
					clear={true}
					value={this.state.school}
					onChange={v=>this.setState({school:v})}
					placeholder="学校 如:韶关学院"
				/>
				<WhiteSpace size="lg" />
				<List>
					<Flex>
						<Flex.Item>
							<RadioItem className={style.cetType} checked={!this.state.isCet6} onChange={(e) => this.setState({isCet6:!this.state.isCet6})}>
								{'英语四级'}
							</RadioItem>
						</Flex.Item>
						<Flex.Item>
							<RadioItem className={style.cetType} checked={this.state.isCet6} onChange={(e) => this.setState({isCet6:!this.state.isCet6})}>
								{'英语六级'}
							</RadioItem>
						</Flex.Item>
					</Flex>
				</List>
			</div>
		);
	}
	// componentDidUpdate(){
	// 	if (this.props.isForget&&!this.state.isConn){this.creatConn();}
	// }
	// componentDidMount(){
	// 	if (this.props.isForget&&!this.state.isConn){this.creatConn();}
	// }
	render({isForget},{name,isCet6,ticket,province,school,people,waitting}) {
		return (
			<div class={style.flexcontainer}>
				<Header />
				<WingBlank size="lg">
					<SegmentedControl
						selectedIndex={isForget?1:0}
						values={segVale}
						onChange={this.onChange}
					/>
					<WhiteSpace size="xl" />
					<WhiteSpace size="xl" />
					<InputItem className={style.inputbox}
						clear={true}
						value={name}
						name="name"
						onChange={v=>this.setState({name:v})}
						placeholder="姓名 如:派大星"
					/>
					<WhiteSpace size="lg" />
					{isForget?this.forgetMode():this.nomalMode()}
					<WhiteSpace size="lg" />
					<WhiteSpace size="lg" />
					<Button
						type="primary"
						onClick={this.submitHandler}
						disabled={!(name&&(ticket||province&&provinceList[province]&&school))}
						className={style.br100}
					>提交</Button>
					{/* <Modal
						title={'请稍等'}
						transparent
						maskClosable={false}
						visible={waitting}
						footer={[{ text: '不查了', onPress: this.cancel }]}
					>
						<div style={{textAlign:'center'}}>
							<ActivityIndicator size="large" className={style.loading} />
							<em>前面还有{people}个同学在等候~</em>
						</div>
					</Modal> */}
					<div class={style.lineup} style={"display: "+(waitting?"block":"none")}>
						<div class={style.mask} ></div>
						<div class="am-modal am-modal-transparent" style="width: 5.4rem; height: 2rem;top: 50%;left:50%;position: absolute;margin-left: -2.7rem;;margin-top: -2rem;">
							<div class="am-modal-content">
								<div class="am-modal-header">
									<div class="am-modal-title" id="rcDialogTitle0">
										请稍等!
									</div>
								</div>
								<div class="am-modal-body">
									<div style={{textAlign:'center'}}>
										<ActivityIndicator size="large" className={style.loading} />
										<em>前面还有{people}个同学在等候~</em>
									</div>
								</div>
								<div class="am-modal-footer">
									<div class="am-modal-button-group-v" role="group">
										<a class="am-modal-button" role="button" href="#" onClick={this.cancel}>
											不查了~
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<WhiteSpace size="xl"/>
					<em>ps:如果出现不明错误,请尝试关闭后再打开~</em>
					<WhiteSpace size="xl"/>
					{/* 排队end */}
					<Modal
						title="失败!"
						maskClosable={false}
						transparent
						visible={this.state.errorId}
						footer={[{ text: '确定', onPress: () => { this.setState({errorId:false});} }]}
					>
						{this.state.errorId}
					</Modal>
					{/* errorid */}
				</WingBlank>
			</div>
		);
	}
}
