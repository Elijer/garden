import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        // from data-repo
        repo: 'elijer/garden',
        // from data-repo-id
        repoId: 'R_kgDOML9VrQ',
        // from data-category
        category: 'Announcements',
        // from data-category-id
        categoryId: 'DIC_kwDOML9Vrc4Chq9n',
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/Elijer",
      Portfolio: "https://elijahkennedy.com/",
      LinkedIn: "https://www.linkedin.com/in/eliken/",
      Youtube: "https://www.youtube.com/@elijah_thornberry",
      Music: "https://soundcloud.com/eliahuu",
      Art: "https://app.milanote.com/1R4bQg1yx7aY2T/portfolio?p=waxm3Jjmsfr"
      // Vimeo: "https://vimeo.com/squarrow",
      // Twitter: "https://twitter.com/elijahreissman"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
