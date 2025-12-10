// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string" },
    summary: { type: "string" },
    tags: { type: "list", of: { type: "string" } },
    section: { type: "string", default: "section1" }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  markdown: {
    remarkPlugins: [remarkGfm]
  },
  disableImportAliasWarning: true,
  onSuccess: async (importData) => {
    console.log(`\u2705 Contentlayer: ${importData.allDocuments.length}\uAC1C\uC758 \uBB38\uC11C \uC0DD\uC131 \uC644\uB8CC`);
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-Y67ZGV4P.mjs.map
