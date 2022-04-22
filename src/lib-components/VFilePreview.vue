<template>
  <div>
    <v-card
      elevation="2"
      outlined
      style="height: 200px; overflow: hidden; margin: 0 4px"
    >
      <v-card-title class="text-subtitle-1" style="background: #eeeeee">
        <div class="d-flex align-start flex-row">
          <v-icon left size="30" class="mr-2">
            {{ calculateIcon(document.type) }}
          </v-icon>
          {{ document.name }}
        </div>
      </v-card-title>
      <div>
        <a target="_blank" @click="openInTab(document)">
          <v-img
            v-if="isImage(document)"
            :src="document.data"
            height="200"
            width="200"
            style="margin-left: auto;margin-right: auto;"
            alt="Image preview..."
          >
          </v-img>
          <vue2-pdf-embed
            v-else
            :source="document.data"
            style="max-width: 200px; max-height: 200px; overflow: hidden; margin-left:auto; margin-right:auto"
          />
            <div>
              <div style="position: absolute; left: 0; bottom: 0; margin-bottom: 0">155MB</div>
              <template v-if="!readonly">
                <v-btn
                  class="removeButton"
                  style="position: absolute; right: 0; bottom: 0"
                  elevation="1"
                  icon
                  @click="removeDocument(document.name)"
                >
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </template>
            </div>
        </a>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { VBtn, VIcon } from "vuetify/lib/components";
import { DocumentData } from "@/lib-components/types";
import Vue2PdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed.js";
//import Vue2PdfEmbed from 'vue2-pdf-embed';

@Component({ name: "VFilePreview", components: { VBtn, VIcon, Vue2PdfEmbed } })
export default class VFilePreview extends Vue {
  @Prop()
  document!: DocumentData;

  @Prop({ default: false })
  readonly!: Boolean;

  @Emit()
  input(value: any): any {
    return value;
  }

  created(): void {
    console.log(JSON.stringify(this.document));
  }

  calculateIcon(type: string): string {
    console.log("type: " + type);
    if (type === "image/jpeg" || type === "image/png" || type === "image/gif") {
      return "mdi-image";
    }
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

  removeDocument() {}
}
</script>

<style>
/* hide last added filename in textfield */
.v-file-input .v-file-input__text {
  display: none;
}
</style>

<style scoped>
.removeButton {
  margin: 0;
}

.listWrapper {
  overflow: auto;
  z-index: 10;
  margin-top: -6px;
  margin-bottom: 26px;
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
