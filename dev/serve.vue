<template>
  <v-app>
    <v-form ref="form">
    <VMultiFileInput
      color="primary"
      :schema='{"description": "Dies ist eine Beschreibung."}'
      fullKey="FormField_Datei"
      :rules="['Required']"
      label="File"
    ></VMultiFileInput>

     <v-btn
      color="success"
      class="mr-4"
      @click="validate"
    >
      Validate
    </v-btn>

    </v-form>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Provide } from "vue-property-decorator";

@Component({})
export default class App extends Vue {

  @Provide('formContext')
  formContext = {
    id:'3a33d0d1-e253-11ec-9cf6-00059a3c7a00',
    type:'task'
  }
  @Provide('apiEndpoint') apiEndpoint = 'api/digitalwf-backend-service'

  valid = true;

  validate () {
    (this.$refs.form as Vue & { validate: () => boolean }).validate();
  }

}
</script>
