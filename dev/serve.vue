<template>
  <v-app>
    <v-form ref="form">
      <VMultiFileInput
        color="primary"
        :schema='{"description": "Dies ist eine Beschreibung.", "filePath": "/Documents/", "uuidEnabled": true}'
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
import {Component, Provide} from "vue-property-decorator";

@Component({})
export default class App extends Vue {

  @Provide('formContext')
  formContext = {
    id: 'Task01',
    type: 'task'
  }
  @Provide('apiEndpoint') apiEndpoint = 'api/digitalwf-backend-service'

  valid = true;

  validate() {
    (this.$refs.form as Vue & { validate: () => boolean }).validate();
  }

}
</script>
