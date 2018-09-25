<template>
	<div>
		<div class = "non-brutal">
			<div>
				<!-- <AlgorithmSelection v-bind="{algorithm}"/> -->
			</div>

			<div ref="table">	
				<h2>Hello World</h2>
				<TableHeader />
				<div v-for="(value, key) in processObject" :key="key">
					<TableRow v-bind="{ processName: key }" @updateProcess="updateProcessObject"/>
				</div>	
			</div>

			<div>
				<button type="button" v-on:click="addIntoProcessObject">Add More Process</button>
			</div>
		</div>
		<h3>FCFS</h3>
		<div class = "brutal-fcfs">
			<div v-for="(proc,time,index) in firstCome" :key="proc" class="brutal-pieces" :style="{ width: (fixWidth(Object.keys(firstCome).length) + dynamicWidth(Math.max.apply(Math, Object.keys(firstCome)),
			index != 0 ? parseInt(Object.keys(firstCome)[index]) - parseInt(Object.keys(firstCome)[index-1]) : parseInt(time)) + 'px' )}">{{proc}} <div>{{ time }}</div>	</div>
		</div>

		<h3>SRTN</h3>
		<div class = "brutal-fcfs">
			<div v-for="(proc,time,index) in shortestJob" :key="proc" class="brutal-pieces" :style="{ width: (fixWidth(Object.keys(shortestJob).length) + dynamicWidth(Math.max.apply(Math, Object.keys(shortestJob)),
			index != 0 ? parseInt(Object.keys(shortestJob)[index]) - parseInt(Object.keys(shortestJob)[index-1]) : parseInt(time)) + 'px' )}">{{proc}} <div>{{ time }}</div>	</div>
		</div>

		<h3>RR</h3>
		
		<div class = "brutal-fcfs">
			<div v-for="(proc,time,index) in roundRobin" :key="proc" class="brutal-pieces" :style="{ width: (fixWidth(Object.keys(roundRobin).length) + dynamicWidth(Math.max.apply(Math, Object.keys(roundRobin)),
			index != 0 ? parseInt(Object.keys(roundRobin)[index]) - parseInt(Object.keys(roundRobin)[index-1]) : parseInt(time)) + 'px' )}">{{proc}} <div>{{ time }}</div>	</div>
		</div>

		<h3>TLQ</h3>
		<div class = "brutal-fcfs">
			
			<div v-for="(proc,time,index) in threeLevel" :key="proc" :class="{noBorder: index != 0? proc == Object.values(threeLevel)[index-1] ? true : false : false}" class="brutal-pieces" :style="{ width: (fixWidth(Object.keys(threeLevel).length) + dynamicWidth(Math.max.apply(Math, Object.keys(threeLevel)),
			index != 0 ? parseInt(Object.keys(threeLevel)[index]) - parseInt(Object.keys(threeLevel)[index-1]) : parseInt(time)) + 'px' )}">{{proc}} <div>{{ time }}</div>	</div>
		</div>

	</div>
</template>

<script>
import Vue from 'vue';
import TableHeader from './table/TableHeader';
import TableRow from './table/TableRow';
import AlgorithmSelection from './AlgorithmSelection';
import fcfs from '../algorithm/fcfs'
import rr from '../algorithm/rr'
import srtn from '../algorithm/srtn'
import tlq from '../algorithm/tlq'

export default {
	name: 'Table',
	data() {
		return {
			width: 0,
			algorithm: 'fcfs',
			rowCount: 3,
			processObject: {
				P0: {
					burst: 0,
					arrival: 0,
					priority: 0
				},
				P1: {
					burst: 0,
					arrival: 0,
					priority: 0
				},
				P2: {
					burst: 0,
					arrival: 0,
					priority: 0
				}
			},
		}
	},
	computed: {
		firstCome(){
			let obj = JSON.parse(JSON.stringify(this.processObject))
			return fcfs(obj)
		},
		shortestJob() {
			let obj = JSON.parse(JSON.stringify(this.processObject))
			let tempObj = srtn(obj)
			delete tempObj[0] // Remove time 0
			return tempObj
		},
		roundRobin() {
			let obj = JSON.parse(JSON.stringify(this.processObject))
			return rr(obj)
		},
		threeLevel() {
			let obj = JSON.parse(JSON.stringify(this.processObject))
			return tlq(obj)
		}
		
	},
	mounted() {
		
		this.width = document.getElementsByClassName("brutal-fcfs")[0].offsetWidth * 0.99
		let onresize = (e) => {
		//note i need to pass the event as an argument to the function
			this.width = document.getElementsByClassName("brutal-fcfs")[0].offsetWidth * 0.99
			// console.log(width)
			// height = e.target.outerHeight;
		}
		window.addEventListener("resize", onresize)
	},
	components: {
		AlgorithmSelection,
		TableHeader,
		TableRow
	},
	methods: {
		fixWidth(total) {
			// console.log(total)
			return (this.width / 2) / total
		},
		dynamicWidth(total, myLength) {
			// console.log(myLength)
			// /console.log(Math.max.apply(Math, Object.values(total)))
			return ((this.width / 2) / total) * myLength
		},
		testing: function() {
			this.rowCount++;
			//this.addIntoProcessObject(`P${this.rowCount}`);
			console.log(this.processObject);
		},
		addIntoProcessObject: function() {
			this.rowCount++;
			var keys = Object.keys(this.processObject);
			var tempName = `P${this.rowCount}`;

			for(var i=0; i<keys.length; i++) {
				if(!keys.find(el => el === `P${i+1}`)) {
					tempName = `P${i+1}`;
					break;
				}
			}


			this.$set(this.processObject, tempName, {
				burst: 0,
				arrival: 0,
				priority: 0
			});

			console.log(this.processObject);
		},
		checkExistProcess: function(pName) {
			if(!!Object.keys(this.processObject).find(e => e === pName)) {
				return true;
			}
			return false;
		},
		updateProcessObject: function(p) {
			this.$set(this.processObject, p.processName, {
				burst: parseInt(p.burst),
				arrival: parseInt(p.arrival),
				priority: parseInt(p.priority)
			});
			
			this.rowCount = Object.keys(this.processObject).length;
			console.log(this.processObject);
		},
		deleteRedundancy: function(pName) {
			delete this.processObject[pName];
		}
	},
	
}
</script>

<style scoped>
.non-brutal {
	max-width: 1050px;
	margin: 60px auto;
}
.brutal-fcfs{
	height: 100px;
	margin-top: 20px;
	border-right: 1px solid black;
	/* border-top: 1px solid black;
	border-bottom: 1px solid black;
	border */
	
}

.brutal-pieces {
	border: 1px solid black;
	border-right: none;
	float: left;
	text-align: center;
	line-height: 100px;
	height: 100px;
}
.brutal-pieces div {
	text-align: right;
    position: relative;
	top: -30px;
}
h3 {
	margin-top: 50px;
}
.noBorder {
	border-left: none !important;
}
</style>
