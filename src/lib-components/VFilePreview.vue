<template>
  <div>
    <a target="_blank" @click="openInTab()">
      <v-card class="doc-card" elevation="2" outlined max-width="350px">
        <v-card-title class="text-subtitle-1 title">
          <div class="d-flex align-start flex-row">
            <v-icon left size="30" class="mr-2">
              {{ icon }}
            </v-icon>
            {{ document.name }}
          </div>
        </v-card-title>
        <v-card-text>
          <div class="preview">
            <v-img
              v-if="isImage"
              class="preview-component"
              :src="document.data"
              max-width="200px"
              alt="Image preview..."
            >
            </v-img>

            <vue2-pdf-embed
              v-else-if="document.type === 'application/pdf'"
              :source="document.data"
              class="preview-component"
            />

            <div v-else class="preview-text">Keine Vorschau verfügbar</div>
            <div>
              <div class="footer">{{ formatBytes(0) }}</div>
              <template v-if="!readonly">
                <v-btn
                  class="remove-button ma-1"
                  elevation="1"
                  icon
                  @click.stop="removeDocument"
                >
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </template>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import { VBtn, VIcon } from "vuetify/lib/components";
import { DocumentData } from "@/lib-components/types";

@Component({ name: "VFilePreview", components: { VBtn, VIcon } })
export default class VFilePreview extends Vue {
  @Prop()
  document!: DocumentData;

  @Prop({ default: false })
  readonly!: boolean;

  get byteCharacters() {
    return atob(
      this.document.data.substr(`data:${this.document.type};base64,`.length)
    );
  }

  get icon(): string {
    if (
      this.document.type === "image/jpeg" ||
      this.document.type === "image/png" ||
      this.document.type === "image/gif" ||
      this.document.type === "image/bmp"
    ) {
      return "mdi-image";
    }
    if (this.document.type === "application/pdf") {
      return "mdi-file-pdf";
    }
    if (
      this.document.type === "application/msword" ||
      this.document.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      this.document.type === "application/vnd.oasis.opendocument.text"
    ) {
      return "mdi-file-word";
    }
    if (
      this.document.type === "application/vnd.ms-powerpoint" ||
      this.document.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      this.document.type === "application/vnd.oasis.opendocument.presentation"
    ) {
      return "mdi-file-powerpoint";
    }
    if (
      this.document.type === "application/vnd.ms-excel" ||
      this.document.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      this.document.type === "application/vnd.oasis.opendocument.spreadsheet"
    ) {
      return "mdi-file-excel";
    }
    if (
      this.document.type === "application/xml" ||
      this.document.type === "application/json" ||
      this.document.type === "application/xhtml+xml" ||
      this.document.type === "text/html" ||
      this.document.type === "text/xml"
    ) {
      return "mdi-file-code";
    }
    return "mdi-file";
  }

  get isImage() {
    return (
      this.document.type.toLowerCase() === "image/jpeg" ||
      this.document.type.toLowerCase() === "image/png"
    );
  }

  openInTab(): void {
    const blobUrl = this.blobUrl;
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", this.document.name!);
    document.body.appendChild(link);
    link.click();
  }

  get blobUrl(): string {
    const byteCharacters = this.byteCharacters;

    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: this.document.type });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  }

  formatBytes(decimals = 2) {
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(this.document.size) / Math.log(k));

    return (
      parseFloat((this.document.size / Math.pow(k, i)).toFixed(dm)) +
      " " +
      sizes[i]
    );
  }

  @Emit("remove-document")
  removeDocument() {
    return this.document;
  }
}
</script>

<style scoped>
.remove-button {
  margin: 0;
  background-color: #eeeeee;
  opacity: 70%;
  position: absolute;
  right: 0;
  bottom: 0;
}

.doc-card {
  height: 200px;
  overflow: hidden;
  margin: 0 4px;
}

.title {
  background: #eeeeee;
}

.preview {
  margin: 2px 2px 2px 2px;
  padding: 5px;
}

.v-card:hover {
  background-color: #fafafa;
}

.preview-component {
  margin-left: auto;
  margin-right: auto;
}

.preview-text {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  color: #aaaaaa;
}

.footer {
  position: absolute;
  left: 0;
  bottom: 0;
  margin-bottom: 0;
  color: #aaaaaa;
  font-size: 13px;
  background-color: #eeeeee;
  opacity: 70%;
  border-radius: 0 4px 0 0;
}
</style>
