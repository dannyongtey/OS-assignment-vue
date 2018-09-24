<template>
	<div class="tableHeader">	
		<div v-for="(header, index) in headerData" class="header">
			{{ header }}
		</div>
	</div>
</template>

<script>
const headerData = ['Process', 'Burst Time', 'Arrival Time', 'Priority'];

export default {
	name: 'TableHeader',
	data() {
		return {
			headerData: headerData
		}
	}
}
</script>

<style scoped>
.tableHeader {
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	background-color: #e3e3e3;
	min-height: 60px;
}

.header {
	flex: 0 1 25%;
	position: relative;
}

</style>

