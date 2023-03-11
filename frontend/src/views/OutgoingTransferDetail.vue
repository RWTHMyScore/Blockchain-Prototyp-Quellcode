<template>
  <div>
    <ButtonTemplate 
                  :text="'Back To Outbox'"
                  :classes="`bg-transparent 
                             text-accent-600
                             my-3
                             text-2xl
                             hover:brightness-125
                             `"
                  :useBackArrow="true"
                  :on-click="() => this.$router.go(-1)"
    ></ButtonTemplate>
    <h1 class="text-5xl font-bold mb-1">
      {{ studentName }}
    </h1>
    <h2 class="text-3xl font-bold mb-5 text-gray-500">{{ pageSubtitle }}</h2>

    <ol class="items-center grid grid-cols-3 shadow-md sm:rounded-lg p-6 bg-white">
      <TimeLineElement
        title="Transcript Transfer Order Uploaded"
        :subtitle="'at ' + timeUploaded"
        text="The transcript has been uploaded to your transfer server and is ready to be processed further."
        active />
      <TimeLineElement
        title="Transfer Announced"
        :subtitle="transcriptAnnounced ? 'at ' + timeAnnounced : 'not yet'"
        text="Before transferring a transcript, the transfer is announced on the underlying blockchain by writing the transcript hash."
        :active="transcriptAnnounced" />
      <TimeLineElement
        title="P2P Transfer"
        :subtitle="transcriptTransferred ? 'at ' + timeTransferred : 'not yet'"
        text="Finally, the transcript is transferred to the partner university over an encrypted peer-to-peer connection."
        :active="transcriptTransferred" />
    </ol>

    <div class="items-center shadow-md sm:rounded-lg p-3 bg-white mt-3">
      <h2 class="ml-3 font-semibold text-2xl">Metadata</h2>

        <table class="border-0 ml-3">
          <tbody>
            <tr v-for="row in metadata" :key="row.label">
              <td v-if="!row.hasOwnProperty('value')" class="font-semibold">
                {{ row.label }}
              </td>
              <td v-if="row.hasOwnProperty('value')" class="text-gray-500 pr-6">
                {{ row.label }}
              </td>
              <td>{{ row.value }}</td>
            </tr>
            <tr v-if="this.transcriptAnnounced">
              <td>
                <span class="font-semibold inline-block"
                  >On-chain Announcement</span
                ><a
                  :href="blockExplorerLink"
                  class="
                    ml-3
                    px-2
                    text-base
                    font-sm
                    text-accent-600
                    rounded-lg
                    hover:bg-gray-100
                    inline-block
                  ">
                  <svg
                    class="w-4 h-4 inline-block align-middle"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512">
                    <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                    <path
                      d="M256 64C256 46.33 270.3 32 288 32H415.1C415.1 32 415.1 32 415.1 32C420.3 32 424.5 32.86 428.2 34.43C431.1 35.98 435.5 38.27 438.6 41.3C438.6 41.35 438.6 41.4 438.7 41.44C444.9 47.66 447.1 55.78 448 63.9C448 63.94 448 63.97 448 64V192C448 209.7 433.7 224 416 224C398.3 224 384 209.7 384 192V141.3L214.6 310.6C202.1 323.1 181.9 323.1 169.4 310.6C156.9 298.1 156.9 277.9 169.4 265.4L338.7 96H288C270.3 96 256 81.67 256 64V64zM0 128C0 92.65 28.65 64 64 64H160C177.7 64 192 78.33 192 96C192 113.7 177.7 128 160 128H64V416H352V320C352 302.3 366.3 288 384 288C401.7 288 416 302.3 416 320V416C416 451.3 387.3 480 352 480H64C28.65 480 0 451.3 0 416V128z" />
                  </svg>
                  <span class="inline-block ml-1 align-middle pb-[3px]"
                    >View</span
                  >
                </a>
              </td>
            </tr>
            <tr v-if="this.transcriptAnnounced">
              <td class="text-gray-500 pr-6">Block Hash</td>
              <td>{{ this.transcript.block }}</td>
            </tr>
            <tr v-if="this.transcriptAnnounced">
              <td class="text-gray-500 pr-6">Transaction Hash</td>
              <td>{{ this.transcript.tx }}</td>
            </tr>
          </tbody>
        </table>

        <div class="flex flex-row justify-end items-center mr-3 text-center grow">
          <a
            v-if="
              !transcriptTransferred &&
              partner.address.toLowerCase() !== 'unknown'
            "
            type="button"
            class="
              inline-flex
              items-center
              justify-center
              w-full
              px-8
              py-4
              text-base
              font-bold
              leading-6
              text-white
              bg-accent-600
              border border-transparent
              md:w-auto
              hover:bg-accent-500
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-accent-600
              rounded-2xl
              select-none
              cursor-pointer
              m-4
            "
            @click="() => this.sendTranscript()"
            ><svg
              v-if="justClickedSend"
              role="status"
              class="inline w-5 h-5 mr-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor" /></svg
            >Send<svg
              v-if="!justClickedSend"
              class="w-6 h-6 ml-2 -mr-1 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"></path></svg
          ></a>
          <a
            v-if="
              !transcriptAnnounced && partner.address.toLowerCase() === 'unknown'
            "
            type="button"
            class="
              inline-flex
              items-center
              justify-center
              w-full
              px-8
              py-4
              text-base
              font-bold
              leading-6
              text-white
              bg-gray-600
              border border-transparent
              md:w-auto
              rounded-2xl
              select-none
              m-3
              mw-button
            "
            >Send<svg
              class="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"></path></svg
          ></a>
          <a
            v-if="!transcriptAnnounced"
            type="button"
            class="
              inline-flex
              items-center
              justify-center
              w-full
              px-8
              py-4
              ml-3
              text-base
              font-bold
              leading-6
              text-white
              bg-red-600
              border border-transparent
              md:w-auto
              hover:bg-red-500
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-red-600
              rounded-2xl
              select-none
              cursor-pointer
              mw-button
              m-3
            "
            @click="() => this.deleteTranscript()"
            >Delete</a
          >
        </div>
      </div>

    <div
      class="
        flex-1
        items-center
        shadow-md
        sm:rounded-lg
        p-3
        bg-white
        overflow-x-auto
        mt-3
      ">
      <h2 class="font-semibold text-2xl">Transcript</h2>
      <pre><div v-html="highlightedTranscript"/></pre>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import TimeLineElement from "../components/TimeLineElement.vue";

import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github.css";
import xml from "highlight.js/lib/languages/xml";
import ButtonTemplate from "../components/ButtonTemplate.vue";
hljs.registerLanguage("xml", xml);

export default {
  name: "OutgoingTransferDetail",
  components: { TimeLineElement, ButtonTemplate },
  data() {
    return {
      transcript: null,
      partners: null,
      justClickedSend: false,
    };
  },
  methods: {
    sendTranscript: function () {
      if (this.justClickedSend) return;
      this.justClickedSend = true;
      let apiCallString = this.$config.apihost + "/api/outgoings";
      axios
        .post(apiCallString, {
          token: this.token,
          transcript: this.transcript.id,
          tx: this.transcript.tx,
          block: this.transcript.block
        })
        .then(() => {
          // reload this page
          this.$router.go();
        })
        .catch(() => {
          // reload this page
          this.$router.go();
        });
    },
    deleteTranscript: function () {
      if (this.justClickedSend) return;
      let apiCallString =
        this.$config.apihost +
        "/api/outgoings?id=" +
        this.transcript.id +
        "&token=" +
        this.token;
      axios
        .delete(apiCallString)
        .then(() => {
          this.$router.push("/outgoing");
        })
        .catch(() => {
          // reload this page
          this.$router.go();
        });
    },
  },
  computed: {
    ...mapState({
      token: (state) => state.auth.userToken,
    }),
    studentName() {
      if (this.transcript) {
        return this.transcript.fullname;
      }
      return "?";
    },
    pageSubtitle() {
      if (this.transcript) {
        if (this.transcript.transferTime) {
          return (
            "Transcript transferred to " +
            this.partner.university +
            ", " +
            this.partner.department
          );
        }
        if (this.transcript.announcementTime) {
          return (
            "Transcript announced to " +
            this.partner.university +
            ", " +
            this.partner.department
          );
        }
        return "Transcript uploaded to your transfer server";
      }
      return "Transcript";
    },
    timeUploaded() {
      if (this.transcript) {
        return this.transcript.uploadTime;
      }
      return "?";
    },
    timeAnnounced() {
      if (this.transcript) {
        return this.transcript.announcementTime;
      }
      return "?";
    },
    timeTransferred() {
      if (this.transcript) {
        return this.transcript.transferTime;
      }
      return "?";
    },
    transcriptAnnounced() {
      if (this.transcript) {
        if (this.transcript.announcementTime) {
          return true;
        }
      }
      return false;
    },
    transcriptTransferred() {
      if (this.transcript) {
        if (this.transcript.transferTime) {
          return true;
        }
      }
      return false;
    },
    xmlTranscript() {
      if (this.transcript) {
        return Buffer.from(this.transcript.content, "base64").toString("utf8");
      }
      return "<loading></loading>";
    },
    highlightedTranscript() {
      return hljs.highlight(this.xmlTranscript, { language: "xml" }).value;
    },
    partner() {
      if (this.partners && this.transcript) {
        for (let i = 0; i < this.partners.length; i++) {
          let p = this.partners[i];
          if (
            p.university.toLowerCase() ===
              this.transcript.toUniversity.toLowerCase() &&
            p.department.toLowerCase() ===
              this.transcript.toDepartment.toLowerCase()
          )
            return p;
        }
      }
      return {
        university: undefined,
        department: undefined,
        server: undefined,
        address: "UNKNOWN",
      };
    },
    blockExplorerLink() {
      if (!this.transcriptAnnounced) return "";
      return `${this.$config.explorer}/tx/${this.transcript.tx}`;
    },
    metadata() {
      if (this.transcript) {
        const data = [];
        data.push({ label: "Student Info" });
        data.push({ label: "Student Name", value: this.studentName });
        data.push({
          label: "Home Matriculation Number",
          value: this.transcript.homeMatriculation,
        });
        data.push({ label: "Transcript Recipient" });
        data.push({
          label: "Recipient Department",
          value: this.transcript.toDepartment,
        });
        data.push({
          label: "Recipient University",
          value: this.transcript.toUniversity,
        });
        data.push({
          label: "On-chain Address",
          value: this.partner.address,
        });
        data.push({
          label: "Recipient Transfer Server",
          value: this.partner.server,
        });
        return data;
      }
      return [];
    },
  },
  mounted() {
    let apiCallString1 =
      this.$config.apihost +
      "/api/outgoings?token=" +
      this.token +
      "&id=" +
      this.$route.params.id;
    axios.get(apiCallString1).then(({ data }) => {
      this.transcript = data.message;
    });

    let apiCallString2 = `${this.$config.apihost}/api/partners?token=${this.token}`;
    axios.get(apiCallString2).then(({ data }) => {
      this.partners = data.message;
    });
  },
};
</script>

<style scoped>
  .mw-button {
    min-width: 200px;
  }
</style>
