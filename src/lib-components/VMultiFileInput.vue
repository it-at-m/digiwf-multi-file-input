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
      <div v-for="doc in documents" :key="doc.name">
        <v-card elevation="3" class="d-flex align-center linkline">
          <a target="_blank" class="documentLink" @click="openInTab(doc)">
            <v-img
              v-if="isImage(doc)"
              :src="doc.data"
              class="mr-2"
              max-height="200"
              max-width="200"
              alt="Image preview..."
            />
            <v-icon v-else size="30" class="mr-2">
              {{ calculateIcon(doc.fileType) }}
            </v-icon>
            {{ doc.name }}
          </a>
          <v-spacer />
          <template v-if="!readonly">
            <v-btn class="removeButton" icon @click="removeDocument(doc.name)">
              <v-icon> mdi-delete </v-icon>
            </v-btn>
          </template>
        </v-card>
      </div>
    </div>
    <div class="errormessage">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Inject, Prop, Vue } from "vue-property-decorator";
import { VBtn, VFileInput, VIcon } from "vuetify/lib/components";
import { HumanTaskFileRestControllerApiFactory, ServiceStartFileRestControllerApiFactory } from "@/api/api-client/api";
import FetchUtils from "@/api/FetchUtils";
import mime from "mime";
import globalAxios from "axios";
import { DocumentData, FormContext } from "@/lib-components/types";

@Component({ name: "VMultiFileInput", components: { VBtn, VFileInput, VIcon } })
export default class VMultiFileInput extends Vue {
  model = "";
  fileValue: File | null = null;
  data: any = {};
  documents: DocumentData[] = [];
  errorMessage = "";
  isLoading = false;
  readonly = false;

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

  @Inject('apiEndpoint')
  readonly apiEndpoint!: string;

  @Inject('formContext')
  readonly formContext!: FormContext

  @Emit()
  input(value: any): any {
    return value;
  }

  created(): void {
    this.readonly = this.schema.readOnly;
    if (!this.formContext.id){
      this.errorMessage = "no contextId";
      return;
    }
    this.loadInitialValues();
  }

  get isReadonly(): boolean {
    return this.disabled || this.readonly || this.isLoading;
  }

  get canAddDocument(): boolean {
    return this.documents.length < 10;
  }

  async loadInitialValues() {
    try {
      this.isLoading = true;
      //console.log("loadInitialValues");

      // get filenames
      const filenames = await this.getFilenames();
      for (const filename of filenames) {
        await this.loadFile(filename);
      }
      this.errorMessage = "";
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
    // console.log("addDocument: " + mydata);

    const startTime = new Date().getTime();
    this.isLoading = true;

    try {
      this.isLoading = true;

      const presignedUrl = await this.getPresignedUrlForPost();

      const base64 = this.arrayBufferToBase64(mydata);
      await globalAxios.put(presignedUrl, base64);

      const doc = this.createDocumentDataInstance(
        this.fileValue!.name,
        this.fileValue!.type,
        base64
      );

      this.documents.push(doc);

      this.errorMessage = "";
      this.fileValue = null;
      this.isLoading = false;
      this.input(this.documents);
    } catch (error: any) {
      if (
        error.response &&
        error.response.status &&
        error.response.status == 409
      ) {
        this.errorMessage = "Das Dokument existiert bereits.";
      } else {
        this.errorMessage = "Das Dokument konnte nicht hochgeladen werden.";
      }
      setTimeout(() => {
        this.isLoading = false;
      }, Math.max(0, 5000 - (new Date().getTime() - startTime)));
    }
    this.isLoading = false;
  }

  createDocumentDataInstance(name: string, type: string, data: string) {
    const doc: DocumentData = {
      type: type,
      name: name,
      data: this.toDataUrl(type, data)
    }
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
    if (this.formContext.type === 'start'){
      res = await ServiceStartFileRestControllerApiFactory(cfg).getFileNames1(
        this.formContext.id,
        this.getFullKey()
      );
    }
    else {
      res = await HumanTaskFileRestControllerApiFactory(cfg).getFileNames(
        this.formContext.id,
        this.getFullKey()
      );
    }
    // console.log("Filenames: "+res.data);

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
    if (this.formContext.type === 'start'){
      res = await ServiceStartFileRestControllerApiFactory(cfg).getPresignedUrlForFileUpload1(
      this.formContext.id,
      this.getFullKey(),
      this.fileValue!.name
      );
    }
    else {
      res = await HumanTaskFileRestControllerApiFactory(cfg).getPresignedUrlForFileUpload(
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
    if (this.formContext.type === 'start'){
      res = await ServiceStartFileRestControllerApiFactory(cfg).getPresignedUrlForFileDownload1(
      this.formContext.id,
      this.getFullKey(),
      filename
      );
    }
    else {
      res = await HumanTaskFileRestControllerApiFactory(cfg).getPresignedUrlForFileDownload(
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
    if (this.formContext.type === 'start'){
      res = await ServiceStartFileRestControllerApiFactory(cfg).getPresignedUrlForFileDeletion1(
      this.formContext.id,
      this.getFullKey(),
      filename
      );
    }
    else {
      res = await HumanTaskFileRestControllerApiFactory(cfg).getPresignedUrlForFileDeletion(
      this.formContext.id,
      this.getFullKey(),
      filename
      );
    }

    return res.data;
  }

  changeInput(/*fileInput: any*/) {
    if (!this.fileValue) {
      return;
    }

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

  calculateIcon(type: string): string {
    if (type === "application/pdf") {
      return "mdi-file-pdf";
    }
    if (
      type === "application/msword" ||
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/vnd.oasis.opendocument.text"
    ) {
      return "mdi-file-word";
    }
    if (
      type === "application/vnd.ms-powerpoint" ||
      type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      type === "application/vnd.oasis.opendocument.presentation"
    ) {
      return "mdi-file-powerpoint";
    }
    if (
      type === "application/vnd.ms-excel" ||
      type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      type === "application/vnd.oasis.opendocument.spreadsheet"
    ) {
      return "mdi-file-excel";
    }
    if (
      type === "application/xml" ||
      type === "application/json" ||
      type === "application/xhtml+xml" ||
      type === "text/html" ||
      type === "text/xml"
    ) {
      return "mdi-file-code";
    }
    return "mdi-file";
  }

  async removeDocument(filename: string): Promise<void> {
    console.log("removeDocument: " + filename);
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].name == filename) {
        try {
          const presignedDeleteUrl = await this.getPresignedUrlForDelete(
            filename
          );
          await globalAxios.delete(presignedDeleteUrl);
          this.documents.splice(i, 1);
          break; // only remove first item
        } catch (error) {
          this.errorMessage = "Die Datei konnte nicht gelöscht werden.";
        }
      }
    }
    this.input(this.documents);
  }

  isImage(doc: DocumentData): boolean {
    return (
      doc.type.toLowerCase() === "image/jpeg" ||
      doc.type.toLowerCase() === "image/png"
    );
  }

  openInTab(doc: DocumentData): void {
    const blobUrl = this.toBlobUrl(doc.data, doc.type!);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", doc.name!);
    document.body.appendChild(link);
    link.click();
  }

  toBlobUrl(base64Data: any, contentType: string): string {
    const byteCharacters = atob(
      base64Data.substr(`data:${contentType};base64,`.length)
    );
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
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
/* remove messages from v-input to make adjacent list seamless  */
.v-file-input .v-text-field__details {
  display: none;
  margin-bottom: 0px;
}
.v-input__slot {
  margin-bottom: -1px;
}
</style>

<style scoped>
.removeButton {
  margin: 0;
}

.listWrapper {
  overflow: auto;
  z-index: 10;
  margin-top: 0px;
}

.errormessage {
  margin-bottom: 24px;
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
  font-size: 12px;
  padding-left: 6px;
  word-break: break-word;
}

.documentLink {
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.linkline {
  margin: 2px 2px 2px 2px;
  padding: 5px;
}

.linkline:hover {
  background-color: #fafafa;
}
</style>
