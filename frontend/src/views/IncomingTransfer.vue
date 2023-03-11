<template>
  <div>
    <div>
      <svg
        class="w-14 mt-5 mr-5 float-left"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M447 56.25C443.5 42 430.7 31.1 416 31.1H96c-14.69 0-27.47 10-31.03 24.25L3.715 304.9C1.247 314.9 0 325.2 0 335.5v96.47c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48v-96.47c0-10.32-1.247-20.6-3.715-30.61L447 56.25zM352 352H160L128 288H72.97L121 96h270l48.03 192H384L352 352z" />
      </svg>
      <div class="flex">
        <h1 class="text-5xl font-bold flex-grow">Transcript Transfer Inbox:</h1>

        <a
          type="button"
          class="
            inline-flex
            items-center
            justify-center
            w-full
            px-4
            py-3
            text-base
            font-bold
            leading-6
            border-2 border-accent-600
            md:w-auto
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-accent-600
            rounded-2xl
            select-none
            cursor-pointer
          "
          :class="
            showWarnings
              ? 'bg-accent-600 text-white hover:bg-accent-500'
              : 'bg-transparent text-accent-600 hover:bg-gray-200'
          "
          @click="
            () => {
              showWarnings = !showWarnings;
              retrieveWarnings();
            }
          ">
          Toggle Warnings</a
        >
      </div>

      <h1 class="text-5xl font-bold text-accent-600 mb-5">{{ titlePartTwo }}</h1>
    </div>

    <div v-if="showWarnings" class="block p-6 rounded-lg shadow-lg bg-white">
      <h2 class="text-3xl font-bold mb-5">Inbox Warnings</h2>

      <div class="flex flex-col">
        <div class="overflow-x-auto shadow-md sm:rounded-lg">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200 table-fixed">
                <thead class="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      class="
                        py-3
                        px-6
                        text-xs
                        font-medium
                        tracking-wider
                        text-left text-gray-700
                        uppercase
                      ">
                      Timestamp
                    </th>
                    <th
                      scope="col"
                      class="
                        py-3
                        px-6
                        text-xs
                        font-medium
                        tracking-wider
                        text-left text-gray-700
                        uppercase
                      ">
                      recipient
                    </th>
                    <th
                      scope="col"
                      class="
                        py-3
                        px-6
                        text-xs
                        font-medium
                        tracking-wider
                        text-left text-gray-700
                        uppercase
                      ">
                      sender
                    </th>
                    <th
                      scope="col"
                      class="
                        py-3
                        px-6
                        text-xs
                        font-medium
                        tracking-wider
                        text-left text-gray-700
                        uppercase
                      ">
                      Warning
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="w in warnings"
                    :key="w.id"
                    class="hover:bg-gray-100">
                    <td
                      class="
                        py-4
                        px-6
                        text-sm
                        font-medium
                        text-gray-500
                        whitespace-nowrap
                      ">
                      {{ w.time }}
                    </td>
                    <td
                      class="
                        py-4
                        px-6
                        text-sm
                        font-medium
                        text-gray-900
                        whitespace-nowrap
                      ">
                      {{ w.recipient }}
                    </td>
                    <td
                      class="
                        py-4
                        px-6
                        text-sm
                        font-medium
                        text-gray-900
                        whitespace-nowrap
                      ">
                      {{ w.sender }}
                    </td>
                    <td class="py-4 px-6 text-sm font-medium text-gray-900">
                      {{ w.comment }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="!warnings || warnings.length == 0"
              class="
                text-center
                py-4
                px-6
                text-sm
                font-medium
                text-gray-900
                whitespace-nowrap
                uppercase
              ">
              Empty
            </div>
          </div>
        </div>
      </div>
    </div>

    <TransferTable
              :headers="['Student Name', 'Transfer Time', 'Sender', 'Status', 'Read']"
              :keys="['fullname','time','sender','valid', 'read']"
              :partners="partners"
              :classes="'pt-5'"
              :to="'/incoming/'"
              :hasSearch="true"
              :colWidth="'16.6667%'"
              :transcripts="transcripts">

    </TransferTable>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import TransferTable from "../components/TransferTable.vue";

export default {
  name: "IncomingTransfer",
  components: {'TransferTable':TransferTable},
  data() {
    return {
      transcripts: null,
      partners: null,
      warnings: null,
      showWarnings: false,
      departmentName: null,
    };
  },
  computed: {
    ...mapState({
      token: (state) => state.auth.userToken,
      userDepartment: (state) => state.auth.userDepartment,
      userRoles: (state) => state.auth.userRoles,
    }),
    titlePartTwo() {
      if (this.userRoles.includes("Owner")) {
        return "All Departments";
      }
      return this.departmentName;
    },
    toggleLabel() {
      return this.showWarnings ? "Hide Warnings" : "Show Warnings";
    },
  },
  mounted() {
    let apiCallString1 =
      this.$config.apihost + "/api/incomings?token=" + this.token;
    axios.get(apiCallString1).then(({ data }) => {
      this.transcripts = data.message.sort((a, b) => b.read - a.read);
    });

    let apiCallString2 = `${this.$config.apihost}/api/partners?token=${this.token}&external=true`;
    axios.get(apiCallString2).then(({ data }) => {
      this.partners = data.message;
    });

    let apiCallString3 = `${this.$config.apihost}/api/departments?token=${this.token}&id=${this.userDepartment}`;
    axios.get(apiCallString3).then(({ data }) => {
      this.departmentName = data.message.name;
    });
  },
  methods: {
    getSenderName: function (address) {
      if (this.partners) {
        for (let i = 0; i < this.partners.length; i++) {
          let p = this.partners[i];
          if (p.address == address) return p.university;
        }
        return "?";
      }
    },
    retrieveWarnings: function () {
      if (this.warnings) {
        return;
      }

      let apiCallString =
        this.$config.apihost + "/api/incomings/errors?token=" + this.token;
      axios.get(apiCallString).then(({ data }) => {
        this.warnings = data.message;
      });
    },
  },
};
</script>

<style scoped></style>
