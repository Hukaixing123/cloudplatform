<template>
  <div id="app">
    <management-header></management-header>
    <management-slider></management-slider>
    <router-view></router-view>
  </div>
</template>

<script>
import ManagementHeader from "./components/ManagementHeader";
import ManagementSlider from "./components/ManagementSlider";
import {login,register,getusers} from "./api/api";
import { async } from 'q';

export default {
  name: 'App',
  mounted: async function () {
    const result = await getusers()
    const kelly = await login('kelly','3')
    //const result = await axios.get('http://localhost:7000/userlist')
    console.log(result,kelly.data)
  },
  components:{
    ManagementHeader,
    ManagementSlider
  }
}
</script>

<style>

</style>
