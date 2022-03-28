<template>
  <v-app>
    <VMultiFileInput
      color="primary"
      :schema="{}"
      fullKey="allOf-0.allOf-0.antragsdaten.datumAntragstellung.currentOneOf.FormField03"
      :rules="[]"
      label="File"
      apiEndpoint="api/digitalwf-backend-service"
      s3Endpoint="s3"
    ></VMultiFileInput>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Provide } from "vue-property-decorator";
import { VMultiFileInput } from "@/entry.esm";
@Component({
  components: { VMultiFileInput },
})
export default class App extends Vue {

  @Provide('contextId') contextId = 'Task01'
}
</script>
