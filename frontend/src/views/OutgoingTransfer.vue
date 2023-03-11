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
          d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z" />
      </svg>
      <h1 class="text-5xl font-bold">Transcript Transfer Outbox:</h1>
      <h1 class="text-5xl font-bold mb-5 text-accent-600">
        {{ titlePartTwo }}
      </h1>

    </div>

    <h2 class="text-3xl font-bold mb-5">Outbox</h2>

    <div class="flex justify-center items-center w-full mb-4">
      <label
        for="dropzone-file"
        class="
          flex flex-col
          justify-center
          items-center
          w-full
          h-32
          bg-gray-50
          rounded-lg
          border-2 border-gray-300 border-dashed
          cursor-pointer
          hover:bg-gray-100
        ">
        <div class="flex flex-col justify-center items-center pt-5 pb-6">
          <svg
            class="mb-3 w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Click to upload </span> (or drag and
            drop) to add a transcript to outbox
          </p>
          <p class="text-xs text-gray-500">XML Transcript Transfer Order</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          class="hidden"
          @change="uploadTranscriptFromFile" />
      </label>
    </div>
    <TransferTable
              :headers="['Student Name', 'Upload Time', 'Status']"
              :keys="['fullname','uploadTime','status']"
              :to="'/outgoing/'"
              :hasSearch="true"
              :colWidth="'25%'"
              :transcripts="queuedTranscripts">
    </TransferTable>


    <h2 class="text-3xl font-bold my-5">Processed</h2>

    <TransferTable
              :headers="['Student Name', 'Upload Time', 'Recipient', 'Status']"
              :keys="['fullname','uploadTime','recipient','status']"
              :partners="partners"
              :hasSearch="true"
              :colWidth="'20%'"
              :to="'/outgoing/'"
              :transcripts="processedTranscripts">

    </TransferTable>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import TransferTable from "../components/TransferTable.vue";

export default {
  name: "OutgoingTransfer",
  components: {'TransferTable':TransferTable},
  data() {
    return {
      transcripts: null,
      partners: null,
      departmentName: null,
    };
  },
  computed: {
    ...mapState({
      token: (state) => state.auth.userToken,
      userDepartment: (state) => state.auth.userDepartment,
      userRoles: (state) => state.auth.userRoles,
    }),
    queuedTranscripts() {
      if (this.transcripts) {
        const openTranscripts = JSON.parse(
          JSON.stringify(
            this.transcripts.filter(
              (t) =>
                t.status.toLowerCase() === "ready" ||
                t.status.toLowerCase() === "announced"
            )
          )
        );
        if (this.partners) {
          for (let j = 0; j < openTranscripts.length; j++) {
            let t = openTranscripts[j];
            let foundPartner = false;
            for (let i = 0; i < this.partners.length; i++) {
              let p = this.partners[i];
              if (
                p.university.toLowerCase() === t.toUniversity.toLowerCase() &&
                p.department.toLowerCase() === t.toDepartment.toLowerCase()
              ) {
                foundPartner = true;
                break;
              }
            }
            if (!foundPartner) {
              t.status = "RECIPIENT UNKNOWN";
            } else {
              t.status = "RECIPIENT ESTABLISHED";
            }
          }
        }
        return openTranscripts;
      }
      return [];
    },
    processedTranscripts() {
      if (this.transcripts) {
        return JSON.parse(
          JSON.stringify(
            this.transcripts.filter(
              (t) => 
                t.status.toLowerCase() !== "ready" &&
                t.status.toLowerCase() !== "announced"
            )
          )
        );
      }
      return [];
    },
    titlePartTwo() {
      if (this.userRoles.includes("Owner")) {
        return "All Departments";
      }
      return this.departmentName;
    },
  },
  mounted() {
    let apiCallString = `${this.$config.apihost}/api/outgoings?token=${this.token}`;
    axios.get(apiCallString).then(({ data }) => {
      this.transcripts = data.message;
    });

    let apiCallString2 = `${this.$config.apihost}/api/partners?token=${this.token}`;
    axios.get(apiCallString2).then(({ data }) => {
      this.partners = data.message;
    });

    let apiCallString3 = `${this.$config.apihost}/api/departments?token=${this.token}&id=${this.userDepartment}`;
    axios.get(apiCallString3).then(({ data }) => {
      this.departmentName = data.message.name;
    });
  },
  methods: {
    uploadTranscript: function (content) {
      let apiCallString = this.$config.apihost + "/api/transcripts";
      axios
        .post(apiCallString, {
          token: this.token,
          content: Buffer.from(content).toString("base64"),
        })
        .then(({ data }) => {
          const transcriptId = data.message;
          this.$router.push("/outgoing/" + transcriptId);
        });
    },
    uploadTranscriptFromFile(ev) {
      // TODO handle more than one file?
      const file = ev.target.files[0];
      if (!file || file.type !== "text/xml") return;

      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        const transcriptOrder = evt.target.result;
        this.uploadTranscript(transcriptOrder);
      };
      reader.onerror = (evt) => {
        console.error(evt);
      };
    },
    getPartnerName: function (address) {
      if (this.partners) {
        for (let i = 0; i < this.partners.length; i++) {
          let p = this.partners[i];
          if (p.address == address) return p.university;
        }
        return "?";
      }
    },
  },
};
</script>

<style scoped>
</style>
