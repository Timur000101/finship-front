<template>
    <b-row cols="12" class="justify-content-center mx-0 vh-100 p-0">
        <div @click="clickMenuBurger()" class="menu-button">
            <i class="fa fa-bars"></i>
        </div>
        <b-col class="p-0 m-0 v-sidebar-menu" @scroll="onSCroll">
            <nav class="sidebar">
                <div class="sidebar-header p-5">
                    <b-img :src="comp_logo"></b-img>
                </div>
                <ul class="mb-3 menu">
                    <li class="menu-item" v-for="(item, index) in menu" :key="index" :to="item.url" :class="item.class" @click="show(index, 'menu_item_'+index)">
                        <router-link tag="a" v-if="item.url" class="menu-item-name" :class="[routepath == item.url ? 'active' : '']" :to="item.url">
                            <i :class="item.icon"></i>
                            {{ item.name }}
                        </router-link>
                        <a v-else @click.prevent="" href=""  class="menu-item-name"> <i :class="item.icon"></i>{{item.name}}</a>
                        <div v-if="item.name == 'Настройки'" class="settings"></div>

                        <ul v-if="item.children" :class="['menu-children' + index]" >
                            <li v-for="(len, ind) in item.children" class="menu-children-item" :key="ind">
                                <div v-if="len.url == '/shops/'" class="shops"></div>
                                <router-link tag="a" class="menu-children-item-link" :class="[routepath == len.url ? 'active' : '']" :to="len.url">{{ len.name }}</router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </b-col>
        <b-col class="main-content overflow-hidden">
            <b-row class="flex-column-reverse align-items-start flex-sm-column-reverse align-items-sm-start flex-md-row justify-content-md-between
                          flex-lg-row justify-content-lg-between flex-xl-row justify-content-xl-between pt-3 pl-3 pr-4 v-header">
                <h4 class="font-weight-bold mt-3">{{ titlePage }}</h4>
                <div class="profile-avatar">
                    <b-avatar class="avatar" id="popover-button-variant" tabindex="0" @click="showCard()" variant="info" src="https://placekitten.com/300/300" size="4rem"></b-avatar>
                    <b-card class="shadow-sm profile-card" style="z-index: 500">
                        <div class="profile-info">
                            <h5>{{fio}}</h5>
                            <p>{{email}}</p>
                        </div>
                        <div class="action-buttons">
                            <b-link class="mb-1 text-decoration-none" href="/profile/">Профиль</b-link>
                            <b-link class="text-decoration-none" href="/logout/">Выход</b-link>
                        </div>
                    </b-card>
                </div>
            </b-row>
            <b-row class="page-content">
                <b-col lg="12" xl="12">
                    <slot></slot>
                </b-col>
            </b-row>
            <div class="toasts" v-show="hidden === 'false'" style="cursor: pointer;">
                <div class="prompt">
                    <router-link to="/shops/create/" tag="div">
                        <span>+</span> Добавить магазин
                    </router-link>
                </div>
            </div>
            <div class="toasts2" v-show="hidden === 'false'" style="cursor: pointer;">
                <div class="prompt">
                    <router-link to="/shops/create/" tag="div">
                        <span>+</span> Добавить магазин
                    </router-link>
                </div>
            </div>
        </b-col>
    </b-row>
</template>

<script>
    import {bus} from "../main"
    import {SidebarMenu} from 'vue-sidebar-menu'
    export default {
        name: "Windows",
        data() {
            return {
                isActive: false,
                showSet: localStorage.getItem('showSettings'),
                hidden: localStorage.getItem("hidden"),
                comp_logo: require ('../../static/comp_logo.svg'),
                count: 0,
                scrolly: 0,
                height: 0,
                height2: 0,
                titlePage: '',
                routepath: this.$route.path,
                toastshow: true,
                fio: '',
                email: '',
                menu: [
                    { name: 'Панель управления', icon: 'fa fa-chart-pie', url: '/panel/' },
                    { name: 'Отправления', icon: 'fa fa-box', url: '/sended/' },
                    { name: 'Финансы', icon: 'fa fa-chart-bar', url: '/finance/' },
                    { name: 'Отчеты', icon: 'fa fa-copy', url: '/reports/' },
                    { name: 'Сервисы', icon: 'fa fa-sliders-h', url: '/services/' },
                    { name: 'Почта/EMS', icon: 'fa fa-envelope', url: '/ems/' },
                    { name: 'Доступ по Апи', icon: 'fa fa-code', url:'',
                        children: [
                            {
                                name: 'Доступ',
                                icon: 'fa fa-file-alt',
                                url: '/aboutapi/',
                            },
                            {
                                name: 'Почта России',
                                icon: 'fa fa-file-alt',
                                url: '/postrussia/',
                            },
                        ],
                    },
                    { name: 'Реф. программа', icon: 'fa fa-atom', url: '/referal/' },
                    { name: 'Настройки', icon: 'fa fa-cog', class: 'border_top', url: '',
                        children: [
                            { name: 'Профиль', url: '/profile/' },
                            { name: 'Магазины', url: '/shops/' },
                            { name: 'Юридические лица', url: '/laws/' },
                            { name: 'Физические лица', url: '/fiz/' },
                            { name: 'Доступы', url: '/permission/' }
                        ]
                    },
                    { name: 'Техническая поддержка', icon: 'fa fa-comments', url: '' },
                ],
            }
        },
        components: {
            SidebarMenu
        },
        mounted() {
            // Подсказка "Добавить магазин"
            // Подсказка "Добавить магазин"
            this.fio = this.$store.getters['auth/firstName'] + " " + this.$store.getters['auth/lastName']
                    + " " + this.$store.getters['auth/patronymic'];
            this.email = this.$store.getters['auth/email'];
            this.onResize()
            window.addEventListener('resize', this.onResize)
            let shops = document.querySelector('.shops')
            let settings = document.querySelector('.settings')
            if (settings){
                let top = settings.getBoundingClientRect().top
                let toast = document.querySelector('.toasts')
                toast.style.top = `${this.scrolly+top-25}px`
                this.height = top
            }
            let toast = document.querySelector('.toasts')
            let toast2 = document.querySelector('.toasts2')
            let menuChildren8 = document.querySelector('.menu-children8');
            if (menuChildren8.classList.contains('show')){
                toast2.style.opacity = 1
                toast.style.display = "none"
            }else{
                toast2.style.opacity = 0
            }
            if (shops){
                let top2 = shops.getBoundingClientRect().top
                let toast2 = document.querySelector('.toasts2')
                toast2.style.top = `${this.scrolly+top2}px`
                this.height2 = top2
            }
            bus.$on("namechange", data => {
                this.titlePage = data
            })
            bus.$on("createshops", data => {
                if (data){
                    this.toastshow = false
                }
            })
            // Hide prompt on mobile version
            if (window.matchMedia("(max-width: 700px)").matches) {
                this.toastshow = false
            } else {
                this.toastshow = true
            }
        },
        methods: {
            onSCroll(){
                let settings = document.querySelector('.settings')
                let shops = document.querySelector('.shops')
                if (settings){
                    let top = settings.getBoundingClientRect().top
                    let toast = document.querySelector('.toasts')
                    toast.style.top = `${this.scrolly+top-55}px`
                    this.height = top
                }
                if (shops){
                    let top2 = shops.getBoundingClientRect().top
                    let toast2 = document.querySelector('.toasts2')
                    toast2.style.top = `${this.scrolly+top2}px`
                    this.height2 = top2
                }
            },
            onToggleCollapse(collapsed) {
                this.collapsed = collapsed
            },
            onResize() {
                if (window.innerWidth <= 767) {
                    this.isOnMobile = true
                    this.collapsed = true
                } else {
                    this.isOnMobile = false
                    this.collapsed = false
                }
            },
            show(index, classs) {
                if(index === 8) {
                    this.count+=1
                    let menuChildren8 = document.querySelector('.menu-children8');
                    menuChildren8.classList.toggle("show");

                    let toast = document.querySelector('.toasts')
                    toast.style.display = "none"
                    let toast2 = document.querySelector('.toasts2')
                    if (menuChildren8.classList.contains('show')){
                        toast2.style.opacity = 1
                        this.onSCroll()
                        localStorage.setItem('showSettings', true)
                    }else{
                        toast2.style.opacity = 0
                        localStorage.setItem('showSettings', false)
                    }
                } else if (index === 6) {
                    let menuChildren6 = document.querySelector('.menu-children6');
                    menuChildren6.classList.toggle("show");
                    this.onSCroll()
                }
            },
            showCard() {
                let profileCard = document.querySelector('.profile-card');
                profileCard.classList.toggle("show-card");
            },
            clickMenuBurger() {
                let menuBurger = document.querySelector('.menu-button');
                let sidebar = document.querySelector('.v-sidebar-menu');
                menuBurger.classList.toggle("click");
                sidebar.classList.toggle("show-sidebar");
            },
        },
    }
</script>
<style lang="scss">
    @import "./src/assets/scss/styles.scss";
</style>