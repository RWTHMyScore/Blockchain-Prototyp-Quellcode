<template>
  <div>
    <!-- Section 1 -->
    <section class="w-full px-8 py-32 xl:px-8">
      <div class="max-w-5xl mx-auto">
        <div class="flex flex-col items-center md:flex-row">
          <div class="w-full mt-16 mx-auto md:mt-0 md:w-2/5">
            <form
              @submit="login"
              class="
                relative
                z-10
                h-auto
                p-8
                py-10
                overflow-hidden
                bg-white
                border-b-2 border-gray-300
                rounded-lg
                shadow-2xl
                px-7
              ">
              <h3 class="mb-6 text-2xl font-medium text-center">
                Sign in to your Account
              </h3>
              <input
                type="text"
                name="email"
                class="
                  block
                  w-full
                  px-4
                  py-3
                  mb-4
                  border border-2 border-gray-200
                  rounded-lg
                  focus:ring focus:ring-accent-600 focus:outline-none
                "
                placeholder="Email address"
                v-model="email" />
              <input
                type="password"
                name="password"
                class="
                  block
                  w-full
                  px-4
                  py-3
                  mb-4
                  border border-2 border-gray-200
                  rounded-lg
                  focus:ring focus:ring-accent-600 focus:outline-none
                "
                placeholder="Password"
                v-model="password" />
              <div class="block">
                <button
                  class="
                    w-full
                    px-3
                    py-4
                    font-medium
                    text-white
                    bg-accent-600
                    hover:bg-accent-400
                    rounded-lg
                  "
                  type="submit">
                  Sign in
                </button>
              </div>
              <p class="w-full mt-4 text-sm text-center text-gray-500">
                Don't have an account?
                <router-link to="/signup" class="text-blue-500 underline"
                  >Sign up here</router-link
                >
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="loginFailed"
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
      <div class="ml-3 text-sm font-normal">Invalid Login.</div>
      <button
        type="button"
        @click="loginFailed = false"
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

export default {
  name: "LoginPage",
  data() {
    return {
      email: null,
      password: null,
      loginFailed: false,
    };
  },
  methods: {
    login: function (event) {
      event.preventDefault();
      let apiCallString = this.$config.apihost + "/api/login";
      axios
        .post(apiCallString, { email: this.email, password: this.password })
        .then(({ data }) => {
          this.$store.commit("auth/setUser", data.message);
          this.$router.push("/home");
        })
        .catch(() => {
          this.loginFailed = true;
          this.password = "";
        });
    },
  },
};
</script>

<style scoped></style>
