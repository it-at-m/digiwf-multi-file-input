<template>
  <div class="pa-0">
    <VFileInput
      v-model="fileValue"
      :disabled="isReadonly || !this.canAddDocument"
      :rules="rules ? rules : true"
      :loading="isLoading"
      outlined
      multiple
      :label="label"
      type="file"
      truncate-length="50"
      :error-messages="errorMessage"
      v-bind="schema['x-props']"
      @change="changeInput"
    >
      <template #append-outer>
        <v-tooltip v-if="schema.description" left :open-on-hover="false">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="on.click" @blur="on.blur" retain-focus-on-click>
              <v-icon> mdi-information</v-icon>
            </v-btn>
          </template>
          <div class="tooltip">{{ schema.description }}</div>
        </v-tooltip>
      </template>
    </VFileInput>

    <div v-if="documents && documents.length > 0" class="listWrapper">
      <template v-for="doc in documents">
        <v-file-preview
          :document="doc"
          :key="doc.name"
          :readonly="isReadonly"
          @remove-document="removeDocument"
        />
      </template>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Prop, Vue} from "vue-property-decorator";
import {VFileInput} from "vuetify/lib/components";
import {HumanTaskFileRestControllerApiFactory, ServiceStartFileRestControllerApiFactory,} from "@/api/api-client/api";
import FetchUtils from "@/api/FetchUtils";
import mime from "mime";
import globalAxios from "axios";
import {DocumentData, FormContext} from "@/lib-components/types";
import VFilePreview from "@/lib-components/VFilePreview.vue";
import {v4 as uuidv4} from 'uuid';

@Component({
  name: "VMultiFileInput",
  components: {VFileInput, VFilePreview},
})
export default class VMultiFileInput extends Vue {
  model = "";
  fileValue: File[] | null = null;
  data: any = {};
  documents: DocumentData[] = [];
  errorMessage = "";
  isLoading = false;
  uuid = "";

  @Prop()
  valid: boolean | undefined;

  @Prop()
  readonly: boolean | undefined;

  @Prop()
  hasFocused: boolean | undefined;

  @Prop()
  value: any | undefined;

  @Prop()
  options: any;

  @Prop()
  schema: any;

  @Prop()
  fullKey: any;

  @Prop()
  dense: boolean | undefined;

  @Prop()
  label: string | undefined;

  @Prop()
  disabled: boolean | undefined;

  @Prop()
  rules: any | undefined;

  @Inject("apiEndpoint")
  readonly apiEndpoint!: string;

  @Inject("formContext")
  readonly formContext!: FormContext;

  @Prop()
  on: any;

  input(value: any): any {
    //return without uuid if not enabled
    if (!this.schema.uuidEnabled) {
      return this.on.input({amount: value});
    }
    return this.on.input({
      key: this.uuid,
      amount: value
    });
  }

  created(): void {
    if (!this.formContext.id) {
      this.errorMessage = "no contextId";
      return;
    }

    //initialize uuid if enabled
    if (this.schema.uuidEnabled) {
      if (this.value && this.value.key) {
        this.uuid = this.value.key;
      } else {
        this.uuid = uuidv4();
      }
    }

    this.loadInitialValues();
  }

  get isReadonly(): boolean {
    return (
      this.disabled ||
      this.readonly ||
      this.schema.readOnly ||
      this.isLoading
    );
  }

  get canAddDocument(): boolean {
    return this.documents.length < 10;
  }

  get filePath(): string {
    let path = this.schema.filePath ? this.schema.filePath : '';

    //append uuid to path if enabled
    if (this.schema.uuidEnabled) {
      path = path !== '' ? path + "/" + this.uuid : this.uuid;
    }

    return path;
  }

  async loadInitialValues() {
    try {
      this.isLoading = true;

      // get filenames
      const filenames = await this.getFilenames();
      for (const filename of filenames) {
        await this.loadFile(filename);
      }
      this.errorMessage = "";
      if (this.documents.length > 0) {
        // set dummy value to satisfy "required"-rule
        this.fileValue = [];
        this.fileValue.push(new File([""], this.documents[0].name));
        this.input(this.documents.length);
      }
    } catch (error) {
      this.errorMessage = "Die Dateien konnten nicht geladen werden.";
    }
    this.isLoading = false;
  }

  async loadFile(filename: string) {
    // get presigned url
    const presignedUrl = await this.getPresignedUrlForGet(filename);

    // get file content
    const res = await globalAxios.get(presignedUrl, {
      responseType: "arraybuffer",
    });
    let content = this.arrayBufferToString(res.data);
    let size = this.getEncodedContentSize(content);

    // push data
    const doc = this.createDocumentDataInstance(
      filename,
      this.getMimeType(filename),
      this.base64OfString(content),
      size
    );
    this.documents.push(doc);
  }

  getEncodedContentSize(content: string) {
    if (this.isBase64Encoded(content)) { // deprecated: Files are no longer serialized in Base64 encoding
      let decoded = window.atob(content);
      return decoded.length;
    }
    return content.length;
  }

  getMimeType(filename: string): string {
    const mimetype = mime.getType(filename);
    return mimetype ? mimetype : "plain/text";
  }

  async addDocument(mydata: any, file: File): Promise<void> {
    const startTime = new Date().getTime();
    this.isLoading = true;

    try {
      this.isLoading = true;

      this.validateFileSize(mydata);

      const presignedUrl = await this.getPresignedUrlForPost(file);
      await globalAxios.put(presignedUrl, mydata);

      let content = this.arrayBufferToString(mydata);

      const doc = this.createDocumentDataInstance(
        file!.name,
        file!.type,
        this.base64OfString(content),
        mydata.byteLength
      );

      this.documents.push(doc);

      this.errorMessage = "";
      this.isLoading = false;
      this.input(this.documents.length);
    } catch (error: any) {
      if (
        error.response &&
        error.response.status &&
        error.response.status == 409
      ) {
        this.errorMessage = "Das Dokument existiert bereits.";
      } else if (!this.errorMessage) {
        this.errorMessage = "Das Dokument konnte nicht hochgeladen werden.";
      }
      setTimeout(() => {
        this.isLoading = false;
      }, Math.max(0, 5000 - (new Date().getTime() - startTime)));
    }
    this.isLoading = false;
  }

  validateFileSize(mydata: ArrayBuffer) {
    if (mydata.byteLength > 10485760) {
      this.errorMessage = "Die Datei ist muss kleiner als 10MB sein.";
      throw new Error("File too large.");
    }
  }

  createDocumentDataInstance(
    name: string,
    type: string,
    data: string,
    size: number
  ) {
    const doc: DocumentData = {
      type: type,
      name: name,
      data: this.toDataUrl(type, data),
      size: size!,
    };
    return doc;
  }

  toDataUrl(type: string, data: string): string {
    return `data:${type};base64, ${data}`;
  }

  async getFilenames(): Promise<string[]> {
    const cfg = FetchUtils.getAxiosConfig(FetchUtils.getGETConfig());
    cfg.baseOptions.headers = {"Content-Type": "application/json"};
    cfg.basePath += "/" + this.apiEndpoint;

    let res: any;
    if (this.formContext.type === "start") {
      res = await ServiceStartFileRestControllerApiFactory(cfg).getFileNames1(
        this.formContext.id,
        this.filePath
      );
    } else {
      res = await HumanTaskFileRestControllerApiFactory(cfg).getFileNames(
        this.formContext.id,
        this.filePath
      );
    }

    return res.data;
  }

  async getPresignedUrlForPost(file: File): Promise<string> {
    const cfg = FetchUtils.getAxiosConfig(FetchUtils.getGETConfig());
    cfg.baseOptions.headers = {"Content-Type": "application/json"};
    cfg.basePath += "/" + this.apiEndpoint;

    let res: any;
    if (this.formContext.type === "start") {
      res = await ServiceStartFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileUpload1(
        this.formContext.id,
        file!.name,
        this.filePath
      );
    } else {
      res = await HumanTaskFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileUpload(
        this.formContext.id,
        file!.name,
        this.filePath
      );
    }

    return res.data;
  }

  async getPresignedUrlForGet(filename: string): Promise<string> {
    const cfg = FetchUtils.getAxiosConfig(FetchUtils.getGETConfig());
    cfg.baseOptions.headers = {"Content-Type": "application/json"};
    cfg.basePath += "/" + this.apiEndpoint;

    let res: any;
    if (this.formContext.type === "start") {
      res = await ServiceStartFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileDownload1(
        this.formContext.id,
        filename,
        this.filePath
      );
    } else {
      res = await HumanTaskFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileDownload(
        this.formContext.id,
        filename,
        this.filePath
      );
    }

    return res.data;
  }

  async getPresignedUrlForDelete(filename: string): Promise<string> {
    const cfg = FetchUtils.getAxiosConfig(FetchUtils.getDELETEConfig());
    cfg.basePath += "/" + this.apiEndpoint;

    let res: any;
    if (this.formContext.type === "start") {
      res = await ServiceStartFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileDeletion1(
        this.formContext.id,
        filename,
        this.filePath
      );
    } else {
      res = await HumanTaskFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileDeletion(
        this.formContext.id,
        filename,
        this.filePath
      );
    }

    return res.data;
  }

  changeInput() {
    if (!this.fileValue) {
      return;
    }

    this.errorMessage = "";

    this.fileValue.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          this.addDocument(event.target?.result, file);
        } catch (e: any) {
          this.errorMessage = e.message;
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async removeDocument(document: DocumentData): Promise<void> {
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].name == document.name) {
        try {
          const presignedDeleteUrl = await this.getPresignedUrlForDelete(
            document.name
          );
          await globalAxios.delete(presignedDeleteUrl);
          this.documents.splice(i, 1);
          if (this.documents.length == 0) {
            // set null value to violate "required"-rule
            this.fileValue = null;
          }
          break; // only remove first item
        } catch (error) {
          this.errorMessage = "Die Datei konnte nicht gelöscht werden.";
        }
      }
    }
    this.input(this.documents.length);
  }

  base64OfString(content: string) {
    if (this.isBase64Encoded(content)) { // deprecated: Files are no longer serialized in Base64 encoding
      return content;
    }
    return window.btoa(content);
  }

  arrayBufferToString(buffer: ArrayBuffer) {
    let content = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      content += String.fromCharCode(bytes[i]);
    }
    return content;
  }

  isBase64Encoded(content: string) {
    var base64Regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64Regex.test(content);
  }
}
</script>

<style>
/* hide last added filename in textfield */
.v-file-input .v-file-input__text {
  display: none;
}
</style>

<style scoped>
.listWrapper {
  margin-top: -6px;
  margin-bottom: 26px;
  float: left;
  display: flex;
  flex-wrap: wrap;
}

.tooltip {
  max-width: 200px;
}

.v-input--is-disabled:not(.v-input--is-readonly) {
  pointer-events: all;
}

</style>
