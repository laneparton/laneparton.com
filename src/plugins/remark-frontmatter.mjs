export function remarkFrontmatter() {
    return function (tree, file) {
      if (!file.data.astro.frontmatter.layout) {
        file.data.astro.frontmatter.layout = `${file.cwd}/src/layouts/BlogLayout.astro`;
      }
    };
}