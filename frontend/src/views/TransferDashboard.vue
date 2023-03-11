<template>
  <div>
    <h1 class="text-5xl font-bold mb-2">Welcome, {{ userName }}!</h1>

    <div v-if="userDepartment">
      <h2 class="text-3xl font-bold mb-2">
        Member of the {{ departmentName }}
      </h2>
      Use the navigation menu at the top to start working on transcript
      transfers.
    </div>

    <div v-if="!userDepartment">
      <h2 class="text-3xl font-bold mb-2">
        You are not yet member of a department.
      </h2>
      Please contact your department administrator to get started.
    </div>

    <!-- Section: Design Block -->
    <section v-if="userDepartment || userRoles.includes('Owner')" class="my-32 text-gray-800 text-center">
      <div
        class="
          grid
          md:grid-cols-2
          lg:grid-cols-4
          gap-x-6
          lg:gap-x-0
          items-center
        ">
        <div class="mb-12 lg:mb-0 relative">
          <svg
            class="w-12 h-12 text-accent-600 mx-auto mb-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              fill="currentColor"
              d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z" />
          </svg>
          <h5 class="text-lg font-medium text-accent-600 font-bold mb-4">
            {{ outgoingCount }}
          </h5>
          <h6 class="font-medium text-gray-900">
            Total Transcripts Sent by Department
          </h6>
          <hr
            class="
              absolute
              right-0
              top-0
              w-px
              bg-gray-200
              h-full
              hidden
              lg:block
            " />
        </div>

        <div class="mb-12 lg:mb-0 relative">
          <svg
            class="w-12 h-12 text-accent-600 mx-auto mb-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512">
            <path
              fill="currentColor"
              d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.607 25.607 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z" />
          </svg>
          <h5 class="text-lg font-medium text-accent-600 font-bold mb-4">
            {{ incomingCount }}
          </h5>
          <h6 class="font-medium text-gray-900">
            Total Transcripts Received at Department
          </h6>
          <hr
            class="
              absolute
              right-0
              top-0
              w-px
              bg-gray-200
              h-full
              hidden
              lg:block
            " />
        </div>

        <div class="mb-12 md:mb-0 relative">
          <svg
            class="w-12 h-12 text-accent-600 mx-auto mb-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              fill="currentColor"
              d="M234.5 5.709C248.4 .7377 263.6 .7377 277.5 5.709L469.5 74.28C494.1 83.38 512 107.5 512 134.6V377.4C512 404.5 494.1 428.6 469.5 437.7L277.5 506.3C263.6 511.3 248.4 511.3 234.5 506.3L42.47 437.7C17 428.6 0 404.5 0 377.4V134.6C0 107.5 17 83.38 42.47 74.28L234.5 5.709zM256 65.98L82.34 128L256 190L429.7 128L256 65.98zM288 434.6L448 377.4V189.4L288 246.6V434.6z" />
          </svg>
          <h5 class="text-lg font-medium text-accent-600 font-bold mb-4">
            {{ blockNumber }}
          </h5>
          <h6 class="font-medium text-gray-900">Blockchain Block Number</h6>
          <hr
            class="
              absolute
              right-0
              top-0
              w-px
              bg-gray-200
              h-full
              hidden
              lg:block
            " />
        </div>

        <div class="relative">
          <svg
            class="w-12 h-12 text-accent-600 mx-auto mb-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              fill="currentColor"
              d="M512 80C512 98.01 497.7 114.6 473.6 128C444.5 144.1 401.2 155.5 351.3 158.9C347.7 157.2 343.9 155.5 340.1 153.9C300.6 137.4 248.2 128 192 128C183.7 128 175.6 128.2 167.5 128.6L166.4 128C142.3 114.6 128 98.01 128 80C128 35.82 213.1 0 320 0C426 0 512 35.82 512 80V80zM160.7 161.1C170.9 160.4 181.3 160 192 160C254.2 160 309.4 172.3 344.5 191.4C369.3 204.9 384 221.7 384 240C384 243.1 383.3 247.9 381.9 251.7C377.3 264.9 364.1 277 346.9 287.3C346.9 287.3 346.9 287.3 346.9 287.3C346.8 287.3 346.6 287.4 346.5 287.5L346.5 287.5C346.2 287.7 345.9 287.8 345.6 288C310.6 307.4 254.8 320 192 320C132.4 320 79.06 308.7 43.84 290.9C41.97 289.9 40.15 288.1 38.39 288C14.28 274.6 0 258 0 240C0 205.2 53.43 175.5 128 164.6C138.5 163 149.4 161.8 160.7 161.1L160.7 161.1zM391.9 186.6C420.2 182.2 446.1 175.2 468.1 166.1C484.4 159.3 499.5 150.9 512 140.6V176C512 195.3 495.5 213.1 468.2 226.9C453.5 234.3 435.8 240.5 415.8 245.3C415.9 243.6 416 241.8 416 240C416 218.1 405.4 200.1 391.9 186.6V186.6zM384 336C384 354 369.7 370.6 345.6 384C343.8 384.1 342 385.9 340.2 386.9C304.9 404.7 251.6 416 192 416C129.2 416 73.42 403.4 38.39 384C14.28 370.6 .0003 354 .0003 336V300.6C12.45 310.9 27.62 319.3 43.93 326.1C83.44 342.6 135.8 352 192 352C248.2 352 300.6 342.6 340.1 326.1C347.9 322.9 355.4 319.2 362.5 315.2C368.6 311.8 374.3 308 379.7 304C381.2 302.9 382.6 301.7 384 300.6L384 336zM416 278.1C434.1 273.1 452.5 268.6 468.1 262.1C484.4 255.3 499.5 246.9 512 236.6V272C512 282.5 507 293 497.1 302.9C480.8 319.2 452.1 332.6 415.8 341.3C415.9 339.6 416 337.8 416 336V278.1zM192 448C248.2 448 300.6 438.6 340.1 422.1C356.4 415.3 371.5 406.9 384 396.6V432C384 476.2 298 512 192 512C85.96 512 .0003 476.2 .0003 432V396.6C12.45 406.9 27.62 415.3 43.93 422.1C83.44 438.6 135.8 448 192 448z" />
          </svg>
          <h5 class="text-lg font-medium text-accent-600 font-bold mb-4">
            {{ departmentEther }} ETH
          </h5>
          <h6 class="font-medium text-gray-900 mb-0">
            Department Account Balance
          </h6>
        </div>
      </div>
    </section>
    <!-- Section: Design Block -->
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "TransferDashboard",
  data() {
    return {
      departmentName: "",
      blockNumber: "?",
      outgoingCount: "-",
      incomingCount: "-",
      departmentEther: "-",
    };
  },
  mounted() {
    if (this.userDepartment) {
      const apiCallString = `${this.$config.apihost}/api/departments?token=${this.token}&id=${this.userDepartment}`;
      axios.get(apiCallString).then(({ data }) => {
        this.departmentName = data.message.name;
      });

      const apiCallStringInc = `${this.$config.apihost}/api/incomings/count`;
      axios
        .get(apiCallStringInc, { params: { token: this.token } })
        .then(({ data }) => {
          this.incomingCount = data.message;
        });

      const apiCallStringOut = `${this.$config.apihost}/api/outgoings/count`;
      axios
        .get(apiCallStringOut, { params: { token: this.token } })
        .then(({ data }) => {
          this.outgoingCount = data.message;
        });

      const apiCallStringBalance = `${this.$config.apihost}/api/chain/funds`;
      axios
        .get(apiCallStringBalance, { params: { token: this.token } })
        .then(({ data }) => {
          this.departmentEther = data.message;
        });
    }

    const apiCallStringBlock = `${this.$config.apihost}/api/chain`;
    axios.get(apiCallStringBlock).then(({ data }) => {
      this.blockNumber = data.message.blocknumber;
    });
  },
  computed: mapState({
    token: (state) => state.auth.userToken,
    userName: (state) => state.auth.userName,
    userDepartment: (state) => state.auth.userDepartment,
    userRoles: (state) => state.auth.userRoles,
  }),
};
</script>

<style scoped></style>
