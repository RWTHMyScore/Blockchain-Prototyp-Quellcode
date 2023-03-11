<template>
  <div class="h-screen bg-gray-50 overflow-hidden">
    <nav
      class="bg-white border-gray-200 border-b-2 px-2 sm:px-4 py-1.5 rounded">
      <div class="flex justify-between items-center">
        <a class="flex items-center">
          <span class="self-center font-semibold whitespace-nowrap"
            ><span class="text-xl">Blockchain </span
            ><span class="text-xl text-accent-600 whitespace-nowrap"
              >Transfer Server</span
            ><br /><span class="text-base text-gray-600 whitespace-nowrap">
              @ {{ university }}
            </span></span
          >
        </a>
        <div
          class="
            hidden
            justify-between
            items-center
            w-full
            md:flex md:w-auto md:order-0
          "
          id="mobile-menu-2">
          <ul
            class="
              flex flex-col
              mt-4
              mx-5
              md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium
            ">
            <li>
              <NavItem text="Home" href="/home">
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512">
                  <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                  <path
                    d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z" />
                </svg>
              </NavItem>
            </li>
            <li v-if="userDepartment || userRoles.includes('Owner')">
              <NavItem text="Transcript Transfer Outbox" href="/outgoing">
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512">
                  <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                  <path
                    d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z" />
                </svg>
              </NavItem>
            </li>
            <li v-if="userDepartment || userRoles.includes('Owner')">
              <NavItem text="Transcript Transfer Inbox" href="/incoming">
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512">
                  <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                  <path
                    d="M447 56.25C443.5 42 430.7 31.1 416 31.1H96c-14.69 0-27.47 10-31.03 24.25L3.715 304.9C1.247 314.9 0 325.2 0 335.5v96.47c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48v-96.47c0-10.32-1.247-20.6-3.715-30.61L447 56.25zM352 352H160L128 288H72.97L121 96h270l48.03 192H384L352 352z" />
                </svg>
              </NavItem>
            </li>
            <li
              v-if="userRoles.includes('Owner') || userRoles.includes('Admin')">
              <NavItem text="Admin Panel" href="/admin">
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512">
                  <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                  <path
                    d="M331.8 224.1c28.29 0 54.88 10.99 74.86 30.97l19.59 19.59c40.01-17.74 71.25-53.3 81.62-96.65c5.725-23.92 5.34-47.08 .2148-68.4c-2.613-10.88-16.43-14.51-24.34-6.604l-68.9 68.9h-75.6V97.2l68.9-68.9c7.912-7.912 4.275-21.73-6.604-24.34c-21.32-5.125-44.48-5.51-68.4 .2148c-55.3 13.23-98.39 60.22-107.2 116.4C224.5 128.9 224.2 137 224.3 145l82.78 82.86C315.2 225.1 323.5 224.1 331.8 224.1zM384 278.6c-23.16-23.16-57.57-27.57-85.39-13.9L191.1 158L191.1 95.99l-127.1-95.99L0 63.1l96 127.1l62.04 .0077l106.7 106.6c-13.67 27.82-9.251 62.23 13.91 85.39l117 117.1c14.62 14.5 38.21 14.5 52.71-.0016l52.75-52.75c14.5-14.5 14.5-38.08-.0016-52.71L384 278.6zM227.9 307L168.7 247.9l-148.9 148.9c-26.37 26.37-26.37 69.08 0 95.45C32.96 505.4 50.21 512 67.5 512s34.54-6.592 47.72-19.78l119.1-119.1C225.5 352.3 222.6 329.4 227.9 307zM64 472c-13.25 0-24-10.75-24-24c0-13.26 10.75-24 24-24S88 434.7 88 448C88 461.3 77.25 472 64 472z" />
                </svg>
              </NavItem>
            </li>
            <li v-if="userDepartment || userRoles.includes('Owner')">
              <NavItem class="ml-12" text="Explore Blockchain" href="/explorer">
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512">
                  <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                  <path
                    d="M256 64C256 46.33 270.3 32 288 32H415.1C415.1 32 415.1 32 415.1 32C420.3 32 424.5 32.86 428.2 34.43C431.1 35.98 435.5 38.27 438.6 41.3C438.6 41.35 438.6 41.4 438.7 41.44C444.9 47.66 447.1 55.78 448 63.9C448 63.94 448 63.97 448 64V192C448 209.7 433.7 224 416 224C398.3 224 384 209.7 384 192V141.3L214.6 310.6C202.1 323.1 181.9 323.1 169.4 310.6C156.9 298.1 156.9 277.9 169.4 265.4L338.7 96H288C270.3 96 256 81.67 256 64V64zM0 128C0 92.65 28.65 64 64 64H160C177.7 64 192 78.33 192 96C192 113.7 177.7 128 160 128H64V416H352V320C352 302.3 366.3 288 384 288C401.7 288 416 302.3 416 320V416C416 451.3 387.3 480 352 480H64C28.65 480 0 451.3 0 416V128z" />
                </svg>
              </NavItem>
            </li>
          </ul>
        </div>
        <button
          class="
            font-medium
            text-white
            bg-accent-600
            hover:bg-accent-400
            rounded-lg
            px-3
            py-3
            mt-auto
            mb-auto
            flex
            items-center
            h-10
          "
          @click.self="logout()"
          >
          Logout
        </button>
      </div>
    </nav>
    <aside v-if="userDepartment || userRoles.includes('Owner')" class="pt-1 pb-1 bg-white border-gray-200 border-b-2 px-2 ">
        <div class="flex items-center justify-center">
          <div class="flex w-full justify-between items-center grid-flow-col">
            <div class="flex items-center">
              <div
                class="
                  relative
                  self-center
                  w-10
                  h-10
                  overflow-hidden
                  bg-gray-100
                  rounded-full
                ">
                <div class="inline-flex overflow-hidden relative justify-center items-center w-10 h-10 bg-accent-600 rounded-full dark:bg-accent-600">
                    <span class="font-xl ml-0.5 font-bold tracking-widest text-white dark:text-white">{{initials}}</span>
                </div>
              </div>
              <div>
                <span class="ml-3 whitespace-nowrap"
                  >{{ userName }}
                </span>
                <span v-if="departmentName" class="text-gray-600 whitespace-nowrap"
                  >:
                </span>
                <span class="text-gray-600 whitespace-nowrap"
                  >{{ departmentName }}
                </span>
              </div>
            </div>
            <div>
                  <UserBadge 
                    :text="'University Admin'"
                    :testCondition="userRoles.includes('Owner')"
                  >
                  </UserBadge>
                  <UserBadge 
                    :text="'Department Admin'"
                    :testCondition="userRoles.includes('Admin')"
                  >
                  </UserBadge>
                  <UserBadge 
                    :text="'Exchange Coordinator'"
                    :testCondition="!userRoles.includes('Admin') && !userRoles.includes('Owner')"
                  >
                  </UserBadge>
            </div>
          </div>
        </div>
    </aside>

    <div class="w-full overflow-auto h-full pb-96">
      <div class="container mx-auto py-10 md:w-4/5 w-11/12 px-3">
        <div class="w-full h-full">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import NavItem from "../components/NavItem.vue";
import UserBadge from "../components/UserBadge.vue";

export default {
  name: "PageSkeleton",
  components: {
    NavItem,
    UserBadge
},
  data() {
    return {
      university: this.$config.university,
      departmentName: "",
    };
  },
  mounted() {
    if (this.userDepartment) {
      let apiCallString = `${this.$config.apihost}/api/departments?token=${this.token}&id=${this.userDepartment}`;
      axios.get(apiCallString).then(({ data }) => {
        this.departmentName = data.message.name;
      });
    }
  },
  computed: {
    initials: function() {
      const userName = this.userName.split(' ');
      const initials = userName.shift().charAt(0) + userName.pop().charAt(0);
      return initials.toUpperCase();
    },
    ...mapState({
      token: (state) => state.auth.userToken,
      userName: (state) => state.auth.userName,
      userDepartment: (state) => state.auth.userDepartment,
      userRoles: (state) => state.auth.userRoles,
    })
  },
  methods: {
    logout: function () {
      this.$store.dispatch("auth/logoutUser");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
</style>
