<template>
  <div>
    <!-- Section 1 -->
    <section v-if="!signupSuccess" class="w-full px-8 py-32 xl:px-8">
      <div class="max-w-5xl mx-auto">
        <div class="flex flex-col items-center md:flex-row">
          <div class="w-full space-y-5 md:w-3/5 md:pr-16">
            <p class="font-medium text-accent-600 uppercase">
              Supercharching Education
            </p>
            <h2
              class="
                text-2xl
                font-extrabold
                leading-none
                text-black
                sm:text-3xl
                md:text-5xl
              ">
              Changing The Way Universities Connect.
            </h2>
            <p class="text-xl text-gray-600 md:pr-16">
              Securely and quickly exchange transcripts with other institutions.
              Sensitive data is transmitted directly and integrity proofs are
              logged on a blockchain.
            </p>
          </div>

          <div class="w-full mt-16 md:mt-0 md:w-2/5">
            <div
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
                Create an Account
              </h3>
              <input
                type="text"
                name="firstname"
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
                placeholder="First name"
                v-model="firstname" />
              <input
                type="text"
                name="lastname"
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
                placeholder="Last name"
                v-model="lastname" />
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
                  @click="signup"
                  class="
                    w-full
                    px-3
                    py-4
                    font-medium
                    text-white
                    bg-accent-600
                    hover:bg-accent-400
                    rounded-lg
                  ">
                  Sign Me Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="signupSuccess" class="w-full px-8 py-32 xl:px-8">
      <div class="max-w-5xl mx-auto">
        <div class="flex flex-col items-center md:flex-row">
          <div class="w-full space-y-5 md:px-32">
            <h2
              class="
                text-2xl
                font-extrabold
                leading-none
                text-black
                sm:text-3xl
                md:text-5xl
              ">
              You signed up successfully!
            </h2>
            <p class="font-medium text-accent-600 uppercase">
              One last step
            </p>
            <p class="text-xl text-gray-600 md:pr-16">
              Please contact your department's administrator to get assigned to a department. After that you will have
              access to the system to process transcripts.
            </p>
            <CustomButton
              :on-click="() => this.$router.push('/login')"
              text="To Login"/>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="signupFailed"
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
      <div class="ml-3 text-sm font-normal">Invalid Registration.</div>
      <button
        type="button"
        @click="signupFailed = false"
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
import CustomButton from "@/components/CustomButton";

export default {
  name: "SignUpPage",
  components: {
    CustomButton,
  },
  data() {
    return {
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      signupFailed: false,
      signupSuccess: false,
    };
  },
  methods: {
    signup: function (event) {
      event.preventDefault();
      let apiCallString = this.$config.apihost + "/api/register";
      axios
        .post(apiCallString, {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
        })
        .then(({ data }) => {
          if (data.message) {
            this.signupSuccess = true;
          } else {
            this.signupFailed = true;
          }
        })
        .catch(() => {
          this.signupFailed = true;
        });
    },
  },
};
</script>

<style scoped></style>
