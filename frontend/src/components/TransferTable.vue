<template>
    <div>
        <div v-if="hasSearch && transcripts && transcripts.length != 0" class="search-wrapper h-9 my-2 flex justify-end">
            <label class="leading-9 mx-2 text-base">{{searchTitle}}</label>
            <input class="h-full search-border px-3" type="text" v-model="searchQuery" placeholder="Search Term"/>
        </div>
        <div class="flex flex-col" :class="classes">
            <div class="overflow-x-auto shadow-md sm:rounded-lg">
                <div class="inline-block min-w-full align-middle">
                    <div class="overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead class="bg-gray-100" v-if="headers">
                                <tr>
                                    <th
                                    :style="{'width': colWidth}"
                                    v-for="header in headers"
                                    :key="header"
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
                                    {{header}}
                                    </th>
                                    <th scope="col" class="p-4">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr
                                v-for="t in transcriptList"
                                :key="t.id"
                                @click="onClickTableEl"
                                class="hover:bg-gray-100 cursor-pointer">
                                    <td
                                        v-for="key in keys"
                                        :key="key"
                                        class="
                                        py-4
                                        px-6
                                        text-sm
                                        font-medium
                                        text-gray-900
                                        whitespace-nowrap
                                        ">
                                            <span
                                                v-if="key == 'status' && t['status'].toLowerCase().includes('unknown')"
                                                class="text-red-500">
                                                {{ t.status }}
                                            </span>
                                            <span
                                                v-if="key != 'status' || !t['status'].toLowerCase().includes('unknown')"
                                                class="text-gray-900">
                                                {{ mapping(key, t[key]) }}
                                            </span>
                                    </td>
                                    <td
                                        class="
                                        py-4
                                        px-6
                                        text-sm
                                        font-medium
                                        text-right
                                        whitespace-nowrap
                                        ">
                                        <router-link
                                        :to="to + t.id"
                                        class="text-accent-600 hover:underline"
                                        >VIEW</router-link
                                        >
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div
                        v-if="!isSearching && (!transcripts || transcripts.length == 0)"
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
                    <div
                        v-if="hasSearch && isSearching && (transcriptList.length == 0)"
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
                        No Results
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "TransferTable",
  data: function() {
    return {
        searchQuery: '',
    }
  },
  computed: {
    isSearching() {
        return this.searchQuery && this.searchQuery != ""
    },
    transcriptList() {
        if(this.hasSearch) {
            return this.resultQuery
        }
        else {
            return this.transcripts
        }
    },
    resultQuery() {
      if (this.searchQuery) {
          return this.transcripts.filter(item => {
            return item[this.searchKey].toLowerCase().includes(this.searchQuery.toLowerCase())
          });
      } else {
          return this.transcripts;
      }
    }
  },
  props: {
    headers: {
      type: Array,
      required: true,
    },
    keys: {
      type: Array,
      required: true,
    },
    transcripts: {
      type: Array,
      required: true,
    },
    partners: {
      type: Array,
      required: false,
    },
    classes: {
        type: String,
        required: false,
        default: ""
    },
    to: {
        type: String,
        required: false
    },
    hasSearch: {
        type: Boolean,
        required: false,
        default: false
    },
    searchKey: {
        type: String,
        required: false,
        default: "fullname"
    },
    searchTitle: {
        type: String,
        required: false,
        default: "Search By Name: "
    },
    /*Note: this prop prevents table from collapsing 
      when there are no results after a search.
    */
    colWidth: {
        type: String,
        required: false,
        default: ""
    }
  },
  methods: {
    getPartnerName: function (address) {
      if (this.partners) {
        for (let i = 0; i < this.partners.length; i++) {
          let p = this.partners[i];
          if (p.address == address) return p.university;
        }
        return "?";
      }
    },
    //Small preprocessing of certain known fields
    mapping: function(key, val) {
        switch(key) {
            case 'recipient':
                return this.getPartnerName(val);
            case 'sender':
                return this.getPartnerName(val);
            case 'status':
                return val.toUpperCase();
            case 'read':
                return val ? "YES" : "NO";
            case 'valid':
                return val ? "VERIFIED" : "SUSPICIOUS"
            default:
                return val
        }
    },
    onClickTableEl: function (e) {
        e.preventDefault()
        //Click table link
        e.target.closest('tr').querySelector('a[href]').click()
    }
  }
};
</script>

<style>
    .search-border {
        border: 1px solid #888;
        border-radius: 4px;
        width: 250px;
    }
</style>
