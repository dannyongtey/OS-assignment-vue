<template>
	<div>
		<div>
			<AlgorithmSelection v-bind="{algorithm}"/>
		</div>

		<div ref="table">	
			<h2>Hello World</h2>
			<TableHeader />

			<div v-for="(value, key) in processObject">
				<TableRow v-bind="{ processName: key }" />
			</div>
			
		</div>

		<div>
			<button type="button" v-on:click="addIntoProcessObject">Add More Process</button>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import TableHeader from './table/TableHeader';
import TableRow from './table/TableRow';
import AlgorithmSelection from './AlgorithmSelection';

export default {
	name: 'Table',
	components: {
		AlgorithmSelection,
		TableHeader,
		TableRow
	},
	methods: {
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
				burst: p.burst,
				arrival: p.arrival,
				priority: p.priority
			});
			
			this.rowCount = Object.keys(this.processObject).length;
			console.log(this.processObject);
		},
		deleteRedundancy: function(pName) {
			delete this.processObject[pName];
		}
	},
	data() {
		return {
			algorithm: 'fcfs',
			rowCount: 3,
			processObject: {
				P1: {
					burst: 0,
					arrival: 0,
					priority: 0
				},
				P2: {
					burst: 0,
					arrival: 0,
					priority: 0
				},
				P3: {
					burst: 0,
					arrival: 0,
					priority: 0
				}
			}
		}
	}
}
</script>

<style scoped>
	
</style>
