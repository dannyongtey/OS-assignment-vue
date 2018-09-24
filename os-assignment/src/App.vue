<template>
  <div id="app">
    <Header />
    <Table />
  </div>
</template>

<script>
import Header from './components/Header';
import Table from './components/Table';

export default {
  name: 'App',
  components: {
    Header,
    Table
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto 0 auto;
  max-width: 1050px;  
}
</style>
