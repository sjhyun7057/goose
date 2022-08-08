import router from '@/router'
import axios from 'axios'
import rest from '@/api/rest'

export default {
    state: {
        // token 인증 방식
        token: localStorage.getItem('token') || '',  
        authError: null, // 오류 발생 시
        loginUser: {},
        targetUser: {},
        profileDetail: {},
        
    },
    getters: {
        isLoggedIn: state => !!state.token,    // 로그인 했는지 확인
        authError: state => state.authError,   // 인증 에러
        authHeader: state => ({ Authorization: state.token}),  // 인증 정보
        loginUser: state => state.loginUser,  // 현재 로그인한 유저
        targetUser: state => state.targetUser, // 다른 유저 정보
        profileDetail: state => state.profileDetail, 
        token: state => state.token
    },
    mutations: {
        SET_TOKEN: (state, token) => state.token = token,
        SET_LOGIN_USER: (state, user) => state.loginUser = user,
        SET_AUTH_ERROR: (state, error) => state.authError = error,
        SET_TARGET_USER: (state, user) => state.targetUser = user,
        LOGOUT: () => { 
            localStorage.removeItem('user')
            location.reload();
        },
        SET_PROFILE_DETAIL : (state, data) => state.profileDetail = data,
    },
    actions: {
        login({commit, dispatch},credential){
            axios({
                url: rest.accounts.login(),
                method: 'post',
                data: credential
            })
            .then(res => {
                const token = res.data.accessToken
                dispatch('saveToken', token)
                dispatch('fetchLoginUser')
                dispatch('myStudyList')
                // alert(`${getters.loginUser}님 환영합니다!`)
                router.push({name: 'Home'})
                
            })
            .catch(err => {
                alert('비밀번호를 확인해주세요')
                console.log("catch")
                console.error(err.response.data)
                commit('SET_AUTH_ERROR', err.response.data)
            })
        },
        saveToken({  commit  }, token) {
            commit('SET_TOKEN', token)
            localStorage.setItem('token', token)
        },
        removeToken({  commit  }){
            commit('SET_TOKEN', '')
            localStorage.setItem('token','')
        },

        signup({ commit,dispatch}, credentials){
            console.log("엑시오스 하기 전")
            console.log(credentials)
            axios({
                url: rest.user.user(),
                method: 'post',
                data: credentials
            })
            .then(res => {
                console.log(res.data)
                const token = res.data.accessToken
                dispatch('saveToken', token)
            })
            .catch(err => {
                // console.log(url)
                console.log('catch')
                console.log(err)
                // console.error(err.response.data)
                commit('SET_AUTH_ERROR', err.response.data)
            })
        },
        // 현재 접속중인 이용자
        fetchLoginUser({ commit, getters, dispatch }) {
            if (getters.isLoggedIn) {
              axios({
                url: rest.user.user_myprofile(), 
                method: 'get',
                headers: getters.authHeader,
              })
                .then(res =>{
                    commit('SET_LOGIN_USER', res.data)
                    console.log("로긴 유저 업뎃 완료")}
                )
                .catch(err => {
                  if (err.response.status === 401) {
                    dispatch('removeToken')
                    router.push({ name: 'login' })
                  }
                })
            }
        },
        
        // id값을 통해 해당 유저 정보 획득 (다른 유저 아이디 및 외래키를 통한 정보 접근용)
        fetchUserInfo({  commit, getters  }, user_pk){
            axios({
                url: rest.user.user_check(user_pk),
                method: 'get',
                headers: getters.authHeader,
            })
            .then(res => {
                commit('SET_TARGET_USER', res.data)
            })
            .catch(err => {
                console.log( err,'오류')
            })
        },

        logout({commit, dispatch}) {
            dispatch('removeToken');
            commit('SET_LOGIN_USER',{})
            commit('SET_MY_STUDY_LIST',{})
            commit('SET_SELECTED_STUDY',{})
            router.push({name:'Home'})
        },
        
        user_delete({getters, dispatch}, password) {
            const Swal = require('sweetalert2')
            Swal.fire({
                title:'정말 탈퇴하실건가요??',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                showCloseButton: true,
                showLoaderOnConfirm: true,
            }
            )
            .then((result) => {
                console.log(password)
                if (result.isConfirmed) {
                    axios({
                        url : rest.user.user(),
                        method: 'delete',
                        headers: {'Authorization' : getters.authHeader.Authorization, 'password': password},
                        // data: userId
                    })
                    .then(dispatch('removeToken'))
                        console.log('then2')
                        Swal.fire(
                            '그동안 Goose를 이용해주셔서 감사합니다'
                        )
                    .catch((err) =>{
                        alert('비밀번호를 확인해주세요')
                    })
                    router.push({name:'Home'})
                }
            })
        },
        profileUpdate({getters,dispatch, commit},userform_data) {
            console.log('액시오스 전')
            console.log(userform_data)
            axios({
                url: rest.user.user(),
                method: 'patch',
                data: userform_data,
                headers: getters.authHeader
            })
            .then(res=>{
                // console.log(res.config.data)
                dispatch('fetchLoginUser')
                commit('SET_PROFILE_DETAIL', res.config.data)
                router.push({
                    name: "UserProfile"
                })
            })
            .catch(err=> {
                console.log(err)
            })
        },
        passwordUpdate({getters, dispatch, commit},passwordform_data) {
            console.log('액시오스 전')
            console.log(passwordform_data)
            axios({
                url: rest.user.user_passwordupdate(),
                method: 'patch',
                data: passwordform_data,
                headers: getters.authHeader
            })
            .then(res=>{
                // dispatch('fetchLoginUser')
                dispatch('removeToken')
                alert('비밀번호가 변경되었습니다. 다시 로그인해주세요')
                router.push({
                    name: "Home"
                })
            })
            .catch(err=>{
                alert('기존의 비밀번호와 다른 비밀번호입니다.')
                console.log(err)
            })
        }
    // profileUpdate({ getters, dispatch, commit }, userform_data) {
    //   console.log("액시오스 전");
    //   axios({
    //     url: rest.user.user(),
    //     method: "patch",
    //     data: userform_data,
    //     headers: getters.authHeader,
    //   })
    //     .then((res) => {
    //       // console.log(res.config.data)
    //       dispatch("fetchLoginUser");
    //       commit("SET_PROFILE_DETAIL", res.config.data);
    //       router.push({
    //         name: "UserProfile",
    //       });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
}}
