<template>
  <div>
    <ButtonTemplate
      :text="'Back To Inbox'"
      :classes="`bg-transparent 
    text-accent-600
    my-3
    text-2xl
    hover:brightness-125
    `"
      :useBackArrow="true"
      :on-click="() => this.$router.go(-1)"></ButtonTemplate>
    <h1 class="text-5xl font-bold mb-1">
      {{ studentName }} from {{ partnerUniversity }}
    </h1>
    <h2 class="text-3xl font-bold mb-5 text-gray-500">Incoming Transcript</h2>

    <ol
      class="
        items-center
        grid grid-cols-2
        shadow-md
        sm:rounded-lg
        p-3
        bg-white
      ">
      <TimeLineElement
        title="Transcript Received"
        :subtitle="'at ' + timeReceived"
        text="The transcript was received by the transfer server that is
            constantly listening for direct peer-to-peer data transfers. Upon receiving it, the transfer server ensures
            it has been properly announced on the blockchain. This announcement contains a hash that can be used to
            verify integrity. If the announcement is found, the transcript is saved."
        active />
      <TimeLineElement
        :title="
          validated
            ? 'Transcript Verified'
            : 'Transcript Announcement Suspicious'
        "
        :subtitle="'at ' + timeVerified"
        text="Having found the announcement, transcript validation is almost complete already. As a final step, the
        announcement time is checked. If the announcement is too old, validation is rejected."
        active />
    </ol>

    <div class="items-center shadow-md sm:rounded-lg p-3 bg-white mt-3">
      <h2 class="font-semibold text-2xl">Metadata</h2>

      <table class="border-0">
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
          <tr v-if="this.transcript">
            <td>
              <span class="font-semibold inline-block"
                >On-chain Announcement</span
              ><span><a
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
          <tr v-if="this.transcript">
            <td colspan="2">
              <span class="text-xs">Note, that this transaction hash is reported by the sender and not verified for technical reasons. The transfer was correctly announced, but not necessarily through this transaction.</span>
            </td>
          </tr>
          <tr v-if="this.transcript">
            <td class="text-gray-500 pr-6">Block Hash</td>
            <td>{{ this.transcript.block }}</td>
          </tr>
          <tr v-if="this.transcript">
            <td class="text-gray-500 pr-6">Transaction Hash</td>
            <td>{{ this.transcript.tx }}</td>
          </tr>
        </tbody>
      </table>

      <div class="flex flex-row items-start mt-6 text-center">
        <a
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
          "
          @click="
            () => {
              downloadTranscript();
            }
          "
          >Archive</a
        >

        <label
          for="default-toggle"
          class="
            inline-flex
            relative
            items-center
            ml-28
            cursor-pointer
            mt-4
            pb-4
          ">
          <input
            type="checkbox"
            v-model="readChecked"
            id="default-toggle"
            class="sr-only peer" />
          <div
            class="
              w-11
              h-6
              bg-gray-200
              peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
              rounded-full
              peer
              peer-checked:after:translate-x-full
              peer-checked:after:border-white
              after:content-['']
              after:absolute
              after:top-[2px]
              after:left-[2px]
              after:bg-white
              after:border-gray-300
              after:border
              after:rounded-full
              after:h-5
              after:w-5
              after:transition-all
              peer-checked:bg-accent-600
            "></div>
          <span class="ml-3 text-sm font-bold text-gray-900">Mark as read</span>
        </label>
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
        mt-3
        overflow-x-auto
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
import ButtonTemplate from "./../components/ButtonTemplate.vue";
hljs.registerLanguage("xml", xml);

export default {
  name: "IncomingTransferDetail",
  components: { TimeLineElement, ButtonTemplate },
  data() {
    return {
      transcript: null,
      partners: null,
      readChecked: false,
    };
  },
  methods: {
    getPartner: function (address) {
      if (this.partners) {
        for (let i = 0; i < this.partners.length; i++) {
          let p = this.partners[i];
          if (p.address == address) return p;
        }
        return null;
      }
    },
    downloadTextFile: function (filename, text) {
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    downloadTranscript: function () {
      const d = new Date(this.timeReceived);
      const fn = d.toISOString().slice(0, 10).replace(/-/g, "");
      this.downloadTextFile(
        fn + " " + this.studentName + ".xml",
        this.xmlTranscript
      );
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
    blockExplorerLink() {
      if (this.transcript)
        return `${this.$config.explorer}/tx/${this.transcript.tx}`;
      return "";
    },
    timeReceived() {
      if (this.transcript) {
        return this.transcript.time;
      }
      return "?";
    },
    timeVerified() {
      if (this.transcript) {
        return this.transcript.verifyTime;
      }
      return "?";
    },
    partnerUniversity() {
      if (this.partners && this.transcript) {
        return this.getPartner(this.transcript.sender).university;
      }
      return "?";
    },
    partnerDepartment() {
      if (this.partners && this.transcript) {
        return this.getPartner(this.transcript.sender).department;
      }
      return "?";
    },
    homeDepartment() {
      if (this.partners && this.transcript) {
        return this.getPartner(this.transcript.recipient).department;
      }
      return "?";
    },
    validated() {
      if (this.transcript) {
        return this.transcript.valid == 1;
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
              this.transcript.fromUniversity.toLowerCase() &&
            p.department.toLowerCase() ===
              this.transcript.fromDepartment.toLowerCase()
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
    metadata() {
      if (this.transcript) {
        const data = [];
        data.push({ label: "Student Info" });
        data.push({ label: "Student Name", value: this.studentName });
        data.push({
          label: "Home Matriculation Number",
          value: this.transcript.homeMatriculation,
        });
        data.push({ label: "Transcript Sender" });
        data.push({
          label: "Sender Department",
          value: this.transcript.fromDepartment,
        });
        data.push({
          label: "Sender University",
          value: this.transcript.fromUniversity,
        });
        data.push({
          label: "On-chain Sender Address",
          value: this.partner.address,
        });
        data.push({
          label: "Sender Transfer Server",
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
      "/api/incomings?token=" +
      this.token +
      "&id=" +
      this.$route.params.id;
    axios.get(apiCallString1).then(({ data }) => {
      this.transcript = data.message;
      this.readChecked = data.message.read;
    });

    let apiCallString2 = `${this.$config.apihost}/api/partners?token=${this.token}`;
    axios.get(apiCallString2).then(({ data }) => {
      this.partners = data.message;
    });
  },
  watch: {
    readChecked(newRead, oldRead) {
      if (newRead !== oldRead && newRead !== this.transcript.read) {
        let apiCallString = `${this.$config.apihost}/api/incomings/read`;
        axios
          .post(apiCallString, {
            token: this.token,
            id: this.$route.params.id,
            read: newRead,
          })
          .then(() => {
            this.transcript.read = newRead;
          });
      }
    },
  },
};
</script>

<style scoped>
</style>
