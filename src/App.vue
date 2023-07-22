<template>
	<div class="appwrapper">
		<div class="caption">TEST APP</div>

		<div class="content">
			<div class="action">
				<button @click="getAccount">Get user Address</button>
			</div>

			<div class="action" v-if="address">
				<button @click="getUserInfo">Get user Profile</button>
			</div>

			<div class="action">
				<button @click="getNodeInfo">Get node info</button>
			</div>

			<div class="action">
				<button @click="makePayment">Make Payment</button>
			</div>

			<div class="action">
				<button @click="requestPermissions">Request permissions [messaging]</button>
			</div>

			<div class="action">
				<button @click="alertMessage">Alert Message</button>
			</div>

			<div class="action">
				<button @click="openSettings">Open application settings page</button>
			</div>

			<div class="action">
				<button @click="imageFromMobileCamera">Image From Mobile Camera</button>
			</div>
		</div>

		<div class="subcaption">Additional (test)</div>

		<div class="content">
			<div class="action">
				<input type="file" />
			</div>
		</div>
	</div>

	<div class="emitted" v-if="emitted.length">

		<div class="caption">
			<span>Events</span>
		</div>

		<div class="events">
			<div class="event" v-for="(e, i) in emitted" :key="i">
				<div class="type">
					{{e.type}}
				</div>

				<div class="time">
					{{e.date}}
				</div>

				<div class="json">
					{{e.data}}
				</div>
			</div>
		</div>
		
	</div>

	<div class="lastresult" v-if="lastresult">
		<div class="result">{{lastresult}}</div>
		<div class="close">
			<button @click="clearLastResult">Close</button>
		</div>
	</div>

	<div class="localstorage">
		{{localstorage}}
	</div>

</template>

<script>


export default {
	name: 'App',
	components: {
		
	},

	data : function(){
		return {
			sdk : null,
			lastresult : '',		
			address : '',
			emitted : [],
			localstorage : '',
			locale : ''	
		}
	},

	mounted : function(){

		/// required		

		this.sdk = new window.BastyonSdk()

		this.sdk.init()

		this.sdk.emit('loaded')


		////

		this.sdk.on('action', (d) => {

			this.emitted.push({
				type : 'action',
				data : JSON.stringify(d),
				date : new Date(),
			})
		})

		this.sdk.on('balance', (d) => {

			this.emitted.push({
				type : 'balance',
				data : JSON.stringify(d),
				date : new Date(),
			})
		})

		this.sdk.on('state', (d) => {

			this.emitted.push({
				type : 'state',
				value : d
			})
		})

		this.sdk.on('keyboard', ({height}) => {

			this.emitted.push({
				type : 'keyboard',
				height : height
			})
		})

		this.sdk.get.appinfo().then(({locale}) => {

			console.log('locale', locale)

			this.locale = locale
		})
		
		/*this.sdk.on('test', (d) => {
			console.log("test data", d)
		})*/

		/*sdk.get.account().then(address => {
			console.log("applications: useraddress", address)
		})*/

		/*sdk.rpc('getnodeinfo').then(data => {
				console.log("applications: NODEINFO", data)
		})*/

		this.checkLocalStorageAccess()
	},

	methods : {
		setLastResult : function(){

		},
		clearLastResult : function(){
			this.lastresult = ''
		},

		openSettings: function(){

			this.sdk.helpers.opensettings().then(() => {
				this.lastresult = 'opensettings: success'

			}).catch(e => {
				this.lastresult = e
			})
		},

		imageFromMobileCamera : function(){

			this.sdk.get.imageFromMobileCamera().then((images) => {
				this.lastresult = 'imageFromMobileCamera: success (console.log)'
				console.log(images)

			}).catch(e => {
				this.lastresult = e
			})
		},

		alertMessage: function(){

			this.sdk.helpers.alert('Test message').then(() => {
				this.lastresult = 'alert: success'

			}).catch(e => {
				this.lastresult = e
			})
		},

		requestPermissions : function(){

			this.sdk.request.permissions(['messaging']).then(() => {
				this.lastresult = 'messaging: granted'
			}).catch(e => {
				this.lastresult = e
			})
		},

		getAccount : function(){

			this.sdk.get.account().then(({address, signature}) => {
				console.log(signature)
				this.lastresult = 'user address: ' + address

				this.address = address
			}).catch(e => {
				this.lastresult = e
			})
		},

		getNodeInfo : function(){
			this.sdk.rpc('getnodeinfo').then(data => {
				this.lastresult = JSON.stringify(data, null, '\t')
			}).catch(e => {
				this.lastresult = e
			})
		},

		getUserInfo : function(){

			if(!this.address) return

			this.sdk.rpc('getuserprofile', [[this.address]]).then(data => {
				this.lastresult = JSON.stringify(data, null, '\t')
			}).catch(e => {
				this.lastresult = e
			})
		},

		makePayment: function(){

			var data = {
				'recievers' : [{
					address : 'PR7srzZt4EfcNb3s27grgmiG8aB9vYNV82',
					amount : 0.01
				}], 
				'feemode' : 'include', 
				'message' : ''
			}

			this.sdk.payment(data).then(data => {
				this.lastresult = JSON.stringify(data, null, '\t')
			}).catch(e => {
				this.lastresult = e
			})
		},

		checkLocalStorageAccess : function(){

			
			function allStorage() {

				var values = [],
					keys = Object.keys(localStorage),
					i = keys.length;

				while ( i-- ) {
					values.push( localStorage.getItem(keys[i]) );
				}

				return values;
			}

			localStorage['checkLocalStorageAccess'] = true
			this.localstorage = allStorage()
		}
	}
}
</script>

<style>
.localstorage{
	display: none;
}
.event{
	padding : 0.5em;
	border-bottom : 1px solid #2c3e50;
	overflow: hidden;
}
.event .type{
	font-weight: 700;
}

.event .date{
	opacity: 0.87;
}

.event .json{
	margin-top: 1em;
}

.caption span{
	font-weight: 700;
}

.emitted{
	margin-top: 2em;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
.action{
	display: flex;
	align-items: center;
	margin-bottom: 1em;
}
.lastresult{
	position: fixed;
	bottom : 0;
	left : 0;
	right: 0;
	background: #f5f5f5;
	padding : 1em;
	max-height: 50%;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
	overflow-y: overlay;
	overflow-x: hidden;
	

}
.lastresult .result{
	padding-bottom: 60px;
}
.lastresult .close{
	padding : 1em;
	position : fixed;
	left: 0;
	bottom : 0;
	right: 0;
	z-index: 2;
	background: #f5f5f5;
}

.caption{
	font-size: 1.5em;
	margin-bottom: 1em;
	margin-top: 1em;
	font-weight: 700;
}

.subcaption{
	margin-bottom: 1em;
	font-weight: 700;
}
</style>
