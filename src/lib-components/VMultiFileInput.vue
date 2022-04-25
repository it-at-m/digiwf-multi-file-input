<template>
  <div class="pa-0">
    <VFileInput
      v-model="fileValue"
      :disabled="isReadonly"
      :rules="rules ? rules : true"
      :loading="isLoading"
      outlined
      :label="label"
      type="file"
      truncate-length="50"
      :error-messages="errorMessage"
      v-bind="schema['x-props']"
      @change="changeInput"
    />

    <div v-if="documents && documents.length > 0" class="listWrapper">
      <template v-for="doc in documents">
        <v-file-preview
          :document="doc"
          :key="doc.name"
          @remove-document="removeDocument"
        />
      </template>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Inject, Prop, Vue } from "vue-property-decorator";
import { VFileInput } from "vuetify/lib/components";
import {
  HumanTaskFileRestControllerApiFactory,
  ServiceStartFileRestControllerApiFactory,
} from "@/api/api-client/api";
import FetchUtils from "@/api/FetchUtils";
import mime from "mime";
import globalAxios from "axios";
import { DocumentData, FormContext } from "@/lib-components/types";
import VFilePreview from "@/lib-components/VFilePreview.vue";

@Component({
  name: "VMultiFileInput",
  components: { VFileInput, VFilePreview },
})
export default class VMultiFileInput extends Vue {
  model = "";
  fileValue: File | null = null;
  data: any = {};
  documents: DocumentData[] = [];
  errorMessage = "";
  isLoading = false;

  @Prop()
  valid: boolean | undefined;

  @Prop()
  hasFocused: boolean | undefined;

  @Prop()
  value: string | undefined;

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
  htmlDescription: string | undefined;

  @Prop()
  disabled: boolean | undefined;

  @Prop()
  rules: any | undefined;

  @Inject("apiEndpoint")
  readonly apiEndpoint!: string;

  @Inject("formContext")
  readonly formContext!: FormContext;

  @Emit()
  input(value: any): any {
    return value;
  }

  created(): void {
    if (!this.formContext.id) {
      this.errorMessage = "no contextId";
      return;
    }
    this.loadInitialValues();
  }

  get isReadonly(): boolean {
    return this.disabled || this.schema.readOnly || this.isLoading || !this.canAddDocument;
  }

  get canAddDocument(): boolean {
    return this.documents.length < 10;
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
        this.fileValue = new File([""], this.documents[0].name);
        this.input(this.documents);
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
    const res = await globalAxios.get(presignedUrl);

    // push data
    const doc = this.createDocumentDataInstance(
      filename,
      this.getMimeType(filename),
      res.data
    );
    this.documents.push(doc);
  }

  getMimeType(filename: string): string {
    const mimetype = mime.getType(filename);
    return mimetype ? mimetype : "plain/text";
  }

  async addDocument(mydata: any): Promise<void> {
    const startTime = new Date().getTime();
    this.isLoading = true;

    try {
      this.isLoading = true;

      this.validateFileSize(mydata);

      const base64 = this.arrayBufferToBase64(mydata);
      const presignedUrl = await this.getPresignedUrlForPost();
      await globalAxios.put(presignedUrl, base64);

      const doc = this.createDocumentDataInstance(
        this.fileValue!.name,
        this.fileValue!.type,
        base64,
        mydata.byteLength
      );

      this.documents.push(doc);

      this.errorMessage = "";
      this.isLoading = false;
      this.input(this.documents);
    } catch (error: any) {
      if (
        error.response &&
        error.response.status &&
        error.response.status == 409
      ) {
        this.errorMessage = "Das Dokument existiert bereits.";
      } else if (!this.errorMessage) {
        this.errorMessage = "Das Dokument konnte nicht hochgeladen werden.: ";
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
    size?: number
  ) {
    if (!size) {
      const content = atob(data.substr(`data:${type};base64,`.length));
      size = content.length;
    }
    const doc: DocumentData = {
      type: type,
      name: name,
      data: this.toDataUrl(type, data),
      size: size,
    };
    return doc;
  }

  toDataUrl(type: string, data: string): string {
    const str = "data:" + type + ";base64, " + data;
    return str;
  }

  async getFilenames(): Promise<string[]> {
    const cfg = FetchUtils.getAxiosConfig(FetchUtils.getGETConfig());
    cfg.baseOptions.headers = { "Content-Type": "application/json" };
    cfg.basePath += "/" + this.apiEndpoint;

    let res: any;
    if (this.formContext.type === "start") {
      res = await ServiceStartFileRestControllerApiFactory(cfg).getFileNames1(
        this.formContext.id,
        this.getFullKey()
      );
    } else {
      res = await HumanTaskFileRestControllerApiFactory(cfg).getFileNames(
        this.formContext.id,
        this.getFullKey()
      );
    }

    return res.data;
  }

  /* Manipulates the fullKey of the schema field so it can be evaluated
   * as a path for security reasons.
   *
   * example:
   * input: allOf-0.allOf-0.antragsdaten.datumAntragstellung.currentOneOf.stringProp2
   * output: antragsdaten.datumAntragstellung.stringProp2
   */
  getFullKey(): string {
    let key = this.fullKey!.replaceAll("currentOneOf.", "");
    while (key.startsWith("allOf")) {
      key = key.substr(key.indexOf(".") + 1);
    }
    return key;
  }

  async getPresignedUrlForPost(): Promise<string> {
    const cfg = FetchUtils.getAxiosConfig(FetchUtils.getGETConfig());
    cfg.baseOptions.headers = { "Content-Type": "application/json" };
    cfg.basePath += "/" + this.apiEndpoint;

    let res: any;
    if (this.formContext.type === "start") {
      res = await ServiceStartFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileUpload1(
        this.formContext.id,
        this.getFullKey(),
        this.fileValue!.name
      );
    } else {
      res = await HumanTaskFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileUpload(
        this.formContext.id,
        this.getFullKey(),
        this.fileValue!.name
      );
    }

    return res.data;
  }

  async getPresignedUrlForGet(filename: string): Promise<string> {
    const cfg = FetchUtils.getAxiosConfig(FetchUtils.getGETConfig());
    cfg.baseOptions.headers = { "Content-Type": "application/json" };
    cfg.basePath += "/" + this.apiEndpoint;

    let res: any;
    if (this.formContext.type === "start") {
      res = await ServiceStartFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileDownload1(
        this.formContext.id,
        this.getFullKey(),
        filename
      );
    } else {
      res = await HumanTaskFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileDownload(
        this.formContext.id,
        this.getFullKey(),
        filename
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
        this.getFullKey(),
        filename
      );
    } else {
      res = await HumanTaskFileRestControllerApiFactory(
        cfg
      ).getPresignedUrlForFileDeletion(
        this.formContext.id,
        this.getFullKey(),
        filename
      );
    }

    return res.data;
  }

  changeInput() {
    if (!this.fileValue) {
      return;
    }

    this.errorMessage = '';
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        this.addDocument(event.target?.result);
      } catch (e: any) {
        this.errorMessage = e.message;
      }
    };

    reader.readAsArrayBuffer(this.fileValue);
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
    this.input(this.documents);
  }

  arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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
</style>
