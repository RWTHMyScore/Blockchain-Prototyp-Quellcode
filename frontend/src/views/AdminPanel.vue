<template>
  <div>
    <h1 class="text-5xl font-bold mb-2">
      Admin Panel{{ !userRoles.includes("Owner") ? ":" : "" }}
    </h1>
    <h1
      v-if="!userRoles.includes('Owner')"
      class="text-5xl font-bold mb-5 text-accent-600">
      {{ userDepartmentName }}
    </h1>
    The options here are fairly powerful and have limited safety checks. User
    experience is rudimentary. Proceed with caution.

    <div class="flex flex-row">
      <div class="w-5/7">
        <div
          v-if="userRoles.includes('Owner')"
          class="shadow-md sm:rounded-lg bg-white px-6 pb-3 mt-3">
          <h2 class="text-3xl text-accent-600 font-bold pt-2 mb-2">
            Choose Department to Administrate
          </h2>
          <div>
            You are the University Admin and may freely choose a department that
            will be affected by your actions further down the page.
          </div>
          <select
            v-model="selectedDepartmentId"
            @change="updateSelectedDepartment()"
            class="
              bg-white
              border border-2 border-gray-200
              rounded-lg
              focus:ring-blue-500 focus:border-blue-500
              block
              w-full
              p-2.5
              mt-2
            ">
            <option disabled value="null">Please select one</option>
            <option v-for="d in departments" :key="d.id" :value="d.id">
              {{ d.name }}
            </option>
          </select>
        </div>

        <h2 class="text-3xl font-bold mt-5 mb-2">
          Add User to Your Department
        </h2>
        <div>
          Users who have just created their account can be assigned to your
          department here.
        </div>
        <form @submit="assignDepartment">
          <div class="grid gap-6 lg:grid-cols-2 pt-3">
            <div>
              <input
                type="text"
                name="email"
                class="
                  block
                  w-full
                  h-full
                  pl-4
                  border border-2 border-gray-200
                  rounded-lg
                  focus:ring focus:ring-accent-600 focus:outline-none
                "
                placeholder="Email of account to add"
                v-model="emailToAssign" />
            </div>
            <div>
              <button
                class="
                  font-medium
                  text-white
                  bg-accent-600
                  hover:bg-accent-400
                  rounded-lg
                  px-3
                  py-3
                "
                type="submit">
                Add
              </button>
            </div>
          </div>
        </form>

        <h2 class="text-3xl font-bold mt-5 mb-2">
          Remove User from Your Department
        </h2>
        <div>
          Users can be removed from their department to be added to another
          department later on. If they are never added to a new department,
          their account remains inactive.
        </div>
        <form @submit="removeDepartment">
          <div class="grid gap-6 lg:grid-cols-2 pt-3">
            <div>
              <input
                type="text"
                name="email"
                class="
                  block
                  w-full
                  h-full
                  pl-4
                  border border-2 border-gray-200
                  rounded-lg
                  focus:ring focus:ring-accent-600 focus:outline-none
                "
                placeholder="Email of account to remove"
                v-model="emailToRemove" />
            </div>
            <div>
              <button
                class="
                  font-medium
                  text-white
                  bg-accent-600
                  hover:bg-accent-400
                  rounded-lg
                  px-3
                  py-3
                "
                type="submit">
                Remove
              </button>
            </div>
          </div>
        </form>

        <h2 class="text-3xl font-bold mt-5 mb-2">
          Assign Department Admin to Your Department
        </h2>
        <div>
          When a change of responsibilities happens, you can designate another
          user as a replacement. As a consequence of this action, the old
          department admin is no longer an admin, but still a member of the
          department.
        </div>
        <form @submit="assignDepartmentAdmin">
          <div class="grid gap-6 lg:grid-cols-2 pt-3">
            <div>
              <input
                type="text"
                name="email"
                class="
                  block
                  w-full
                  h-full
                  pl-4
                  border border-2 border-gray-200
                  rounded-lg
                  focus:ring focus:ring-accent-600 focus:outline-none
                "
                placeholder="Assign"
                v-model="emailToAssignAdmin" />
            </div>
            <div>
              <button
                class="
                  font-medium
                  text-white
                  bg-accent-600
                  hover:bg-accent-400
                  rounded-lg
                  px-3
                  py-3
                "
                type="submit">
                Assign
              </button>
            </div>
          </div>
        </form>

        <h2 class="text-3xl font-bold mt-5 mb-2">
          Update Transfer Server URL of Your Department
        </h2>
        <div>
          In case the transfer server API address changes, it needs to be
          updated on the blockchain. Otherwise, other transfer servers will not
          be able to find it. Every department admin has to set this URL.
          Usually, all departments of a university will use the same URL.
        </div>
        <div class="my-3">
          Currently, the address on the blockchain is: {{ currentServerUrl }}
        </div>

        <form @submit="updateServer">
          <div class="grid gap-6 lg:grid-cols-2">
            <div>
              <input
                type="text"
                name="address"
                class="
                  block
                  w-full
                  h-full
                  pl-4
                  border border-2 border-gray-200
                  rounded-lg
                  focus:ring focus:ring-accent-600 focus:outline-none
                "
                placeholder="New Server URL"
                v-model="newServerUrl" />
            </div>
            <div>
              <button
                class="
                  font-medium
                  text-white
                  bg-accent-600
                  hover:bg-accent-400
                  rounded-lg
                  px-3
                  py-3
                "
                type="submit">
                Write to Blockchain
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="items-center ml-3 mt-3">
        <div class="items-center shadow-md sm:rounded-lg bg-white p-2">
          <h2 class="text-3xl font-bold my-2">User Account Utilities</h2>
          <h3 class="text-2xl font-bold my-2">View User Information</h3>
          <div>
            Sometimes you need to see user information to know whether an
            operation is necessary or was successful.
          </div>
          <form @submit="viewUserInformation">
            <div class="grid gap-2 lg:grid-cols-5 mt-3">
              <div class="col-span-4">
                <input
                  type="text"
                  name="address"
                  class="
                    block
                    w-full
                    h-full
                    pl-4
                    border border-2 border-gray-200
                    rounded-lg
                    focus:ring focus:ring-accent-600 focus:outline-none
                  "
                  placeholder="User email"
                  v-model="emailToView" />
              </div>
              <div>
                <button
                  class="
                    block
                    w-full
                    font-medium
                    text-white
                    bg-accent-600
                    hover:bg-accent-400
                    rounded-lg
                    p-3
                  "
                  type="submit">
                  View
                </button>
              </div>
            </div>
          </form>
          <pre class="mt-2 p-2 min-h-[200px] text-sm bg-gray-100 rounded-lg">{{
            userInfo
          }}</pre>

          <h3 class="text-2xl font-bold my-2 pt-3">Reset User Password</h3>
          <div>
            If a user lost his password, a new one can be assigned here.
          </div>
          <form @submit="setUserPassword">
            <div class="grid gap-2 lg:grid-cols-4 mt-3">
              <div class="col-span-3">
                <input
                  type="text"
                  name="address"
                  class="
                    block
                    w-full
                    h-full
                    pl-4
                    border border-2 border-gray-200
                    rounded-lg
                    focus:ring focus:ring-accent-600 focus:outline-none
                    h-[48px]
                  "
                  placeholder="User email"
                  v-model="emailToSetPassword" />
              </div>
              <div class="col-span-3">
                <input
                  type="password"
                  name="password"
                  class="
                    block
                    w-full
                    h-full
                    pl-4
                    border border-2 border-gray-200
                    rounded-lg
                    focus:ring focus:ring-accent-600 focus:outline-none
                  "
                  placeholder="New Password"
                  v-model="newPassword" />
              </div>
              <div>
                <button
                  class="
                    block
                    w-full
                    font-medium
                    text-white
                    bg-accent-600
                    hover:bg-accent-400
                    rounded-lg
                    p-3
                  "
                  type="submit">
                  Assign
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      v-if="actionFailed"
      class="
        absolute
        bottom-5
        right-5
        flex
        items-center
        w-full
        max-w-xs
        p-4
        mb-4
        text-gray-500
        bg-white
        rounded-lg
        shadow
      "
      role="alert">
      <div
        class="
          inline-flex
          items-center
          justify-center
          flex-shrink-0
          w-8
          h-8
          text-red-500
          bg-red-100
          rounded-lg
        ">
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"></path>
        </svg>
      </div>
      <div class="ml-3 text-sm font-normal">{{ errorText }}</div>
      <button
        type="button"
        @click="actionFailed = false"
        class="
          ml-auto
          -mx-1.5
          -my-1.5
          bg-white
          text-gray-400
          hover:text-gray-900
          rounded-lg
          focus:ring-2 focus:ring-gray-300
          p-1.5
          hover:bg-gray-100
          inline-flex
          h-8
          w-8
        "
        aria-label="Close">
        <span class="sr-only">Close</span>
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "AdminPanel",
  data() {
    return {
      newServerUrl: null,
      partners: null,
      userDepartmentName: null,
      departments: null,
      selectedDepartmentId: null,
      emailToAssign: null,
      emailToView: null,
      userInfo: "",
      emailToRemove: null,
      emailToAssignAdmin: null,
      actionFailed: false,
      errorText: "",
      emailToSetPassword: null,
      newPassword: null,
      selectedDepartmentName: null,
    };
  },
  mounted() {
    let apiCallString = `${this.$config.apihost}/api/partners?token=${this.token}`;
    axios.get(apiCallString).then(({ data }) => {
      this.partners = data.message;
    });

    let apiCallString2 = `${this.$config.apihost}/api/departments?token=${this.token}&id=${this.userDepartment}`;
    axios.get(apiCallString2).then(({ data }) => {
      this.userDepartmentName = data.message.name;
    });

    let apiCallString3 = `${this.$config.apihost}/api/departments?token=${this.token}`;
    axios.get(apiCallString3).then(({ data }) => {
      this.departments = data.message;
    });
  },
  computed: {
    ...mapState({
      token: (state) => state.auth.userToken,
      userName: (state) => state.auth.userName,
      userDepartment: (state) => state.auth.userDepartment,
      userRoles: (state) => state.auth.userRoles,
    }),
    currentServerUrl() {
      if (this.partners) {
        const self = this.partners.find(
          (p) =>
            p.university === this.$config.university &&
            p.department === this.selectedDepartmentName || this.userDepartmentName
        );
        if (self) {
          return self.server;
        }
      }
      return "UNKNOWN";
    },
  },
  methods: {
    updateSelectedDepartment: function(){
      if(this.selectedDepartmentId) {
        let apiCallString2 = `${this.$config.apihost}/api/departments?token=${this.token}&id=${this.selectedDepartmentId}`;
        axios.get(apiCallString2).then(({ data }) => {
          this.selectedDepartmentName = data.message.name;
        });
      }
    },
    updateServer: function (event) {
      event.preventDefault();
      let apiCallString = this.$config.apihost + "/api/departments";
      axios
        .put(apiCallString, { token: this.token, server: this.newServerUrl })
        .then(() => {
          // reload this page
          this.$router.go();
        })
        .catch((e) => {
          this.errorText = e.response.data.error;
          this.actionFailed = true;
        });
    },
    assignDepartment: function (event) {
      event.preventDefault();
      let apiCallString = this.$config.apihost + "/api/user/assignDepartment";
      axios
        .put(apiCallString, {
          token: this.token,
          email: this.emailToAssign,
          department: this.userRoles.includes("Owner")
            ? this.selectedDepartmentId
            : this.userDepartment,
        })
        .then(() => {
          // reload this page
          this.$router.go();
        })
        .catch((e) => {
          this.errorText = e.response.data.error;
          this.actionFailed = true;
        });
    },
    assignDepartmentAdmin: function (event) {
      event.preventDefault();
      let apiCallString = this.$config.apihost + "/api/departments";
      axios
        .put(apiCallString, {
          token: this.token,
          admin: this.emailToAssignAdmin,
          department: this.userRoles.includes("Owner")
            ? this.selectedDepartmentId
            : this.userDepartment,
        })
        .then(() => {
          // reload this page
          this.$router.go();
        })
        .catch((e) => {
          this.errorText = e.response.data.error;
          this.actionFailed = true;
        });
    },
    removeDepartment: function (event) {
      event.preventDefault();
      let apiCallString = this.$config.apihost + "/api/user/removeDepartment";
      axios
        .put(apiCallString, {
          token: this.token,
          email: this.emailToRemove,
        })
        .then(() => {
          // reload this page
          this.$router.go();
        })
        .catch((e) => {
          this.errorText = e.response.data.error;
          this.actionFailed = true;
        });
    },
    setUserPassword: function (event) {
      event.preventDefault();
      let apiCallString = this.$config.apihost + "/api/user/setPassword";
      axios
        .put(apiCallString, {
          token: this.token,
          email: this.emailToSetPassword,
          password: this.newPassword,
        })
        .then(() => {
          this.emailToSetPassword = null;
          this.newPassword = null;
        })
        .catch((e) => {
          this.errorText = e.response.data.error;
          this.actionFailed = true;
        });
    },
    viewUserInformation: function (event) {
      event.preventDefault();
      let apiCallString = `${this.$config.apihost}/api/user?token=${this.token}&email=${this.emailToView}`;
      axios
        .get(apiCallString)
        .then(({ data }) => {
          const info = data.message;
          info.roles = info.roles.map((r) => {
            if (r === "Owner") {
              return "University Admin";
            }
            if (r === "Admin") {
              return "Department Admin";
            }
            return r;
          });
          if (info.department) {
            info.department = this.departments.find(
              (d) => d.id === info.department
            ).name;
          }
          this.userInfo = JSON.stringify(info, null, 4);
        })
        .catch(() => {
          this.userInfo = "Failed to find anything";
        });
    },
  },
};
</script>

<style scoped></style>
