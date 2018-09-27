<template>
	<div>
		<form class="tableRow">
			<input v-model="pName" @change="onPNameChange" type="text" name="processName" class="inputForm">
			<input v-model="burst" @change="onDataChange" type="text" name="burst" class="inputForm" placeholder="0">
			<input v-model="arrival" @change="onDataChange" type="text" name="arrival" class="inputForm" placeholder="0">
			<input v-model="priority" @change="onDataChange" type="text" name="priority" class="inputForm" placeholder="0">
		</form>

	</div>
</template>

<script>
export default {
	name: 'TableRow',
	props: ['processName'],
	data() {
		return {
			pName: this.processName,
			burst: 0,
			arrival: 0,
			priority: 0,
			oldPName: this.processName
		}
	},
	methods: {
		testing: function() {
			// console.log();
		},
		onDataChange: function() {
			this.$emit('updateProcess', {
				processName: this.pName,
				burst: this.burst,
				arrival: this.arrival,
				priority: this.priority,
			})
			// this.$parent.updateProcessObject({
			// 	processName: this.pName,
			// 	burst: this.burst,
			// 	arrival: this.arrival,
			// 	priority: this.priority
			// });
			this.oldPName = this.pName;
		},
		onPNameChange: function() {
			this.pName = this.pName.toUpperCase();
			if(this.$parent.checkExistProcess(this.pName)){
				this.pName = this.oldPName;
			}
			else {
				this.$parent.deleteRedundancy(this.oldPName);
				this.onDataChange();
			}
		}
	}
}
</script>

<style>
.tableRow {
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	background-color: #eeeeee;
	min-height: 60px;
}

.inputForm {
	flex: 0 1 25%;
	position: relative;
	background-color: transparent;
	border: none;
	min-height: 60px;
	text-align: center;
}
</style>