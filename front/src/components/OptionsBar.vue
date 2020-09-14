<template>
    <b-col class="px-0 py-1 scrollstyle" style="overflow-x: auto; overflow-y: hidden;">
        <b-nav class="tab-nav pl-2">
            <router-link to="/shops/" exact class="tab-item" >Магазины</router-link>
            <router-link to="/laws/" exact class="tab-item" >Юридические лица</router-link>
            <router-link to="/fiz/" exact class="tab-item" >Физические лица</router-link>
            <router-link to="/profile/" exact class="tab-item" >Профиль</router-link>
            <router-link to="/permission/" exact class="tab-item" >Доступ</router-link>
        </b-nav>
    </b-col>
</template>

<script>
    export default {
        name: "OptionsBar",
    }
</script>

<style lang="scss" scoped>
    .tab-nav {
      position: relative;
      font-size: 0;
      height: 50px;
      flex-wrap: nowrap;
      border-bottom: 1px solid #DFE0EB ;
      .animation {
        height: 2px;
        font-weight: 600;
        background: #1976D2;
        transition: all .3s ease 0s;
      }
      .tab-item {
        display: inline-block;
        text-align: center;
        font-size: 18px;
        color: #000000;
        line-height: 50px;
        position: relative;
        text-decoration: none;
        z-index: 1;
        padding: 0 30px;
          float: none;
      }
        .tab-item:nth-child(1) {
            padding: 0 30px 0 0;
        }
    }
    .router-link-active {
      border-bottom: 2px solid #1976D2;
      font-weight: 600;
    }
    .scrollstyle::-webkit-scrollbar {
        height: 5px;;
    }

    .scrollstyle::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    .scrollstyle::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
    }

</style>