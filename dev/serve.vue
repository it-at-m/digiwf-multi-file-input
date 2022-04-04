<template>
  <v-app>
    <VMultiFileInput
      color="primary"
      :schema="{}"
      fullKey="allOf-0.allOf-0.antragsdaten.datumAntragstellung.currentOneOf.FormField03"
      :rules="[]"
      label="File"
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

  @Provide('formContext')
  formContext = {
    id:'Task01',
    type:'task'
  }
  @Provide('apiEndpoint') apiEndpoint = 'api/digitalwf-backend-service'

}
</script>
