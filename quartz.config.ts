import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Elijah.Kennedy",
    enableSPA: true,
    enablePopovers: true,
    analytics: [
      {
      provider: "umami",
      websiteId: "9937c077-880d-477c-b830-8757700f8784"
      },
      {
        provider: "goatcounter",
        websiteId: "thornberry"
      },
      {
        provider: "google",
        tagId: "G-L3LV7GFPBT"
      },
      {
        provider: "hotjar",
        hjid: 3001133
      },
      {
        provider: "tinylytics",
        siteId: "3Hrgo5AMhTSZ6J5zu3Fs"
      }
    ],
    locale: "en-US",
    baseUrl: "elijer.github.io/garden",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        // header: "Raleway",
        // header: "Merriweather Sans",
        // header: "Robot Mono",
        // header: "Inconsolata",
        // body: "Source Sans Pro",
        body: "Nunito",
        // body: "Raleway",
        // body: "Poppins",
        // body: "Quicksand",
        code: "IBM Plex Mono",
      },
      colors: {
        // lightMode: {
        //   light: "#faf8f8",
        //   lightgray: "#e5e5e5",
        //   gray: "#b8b8b8",
        //   darkgray: "#4e4e4e",
        //   dark: "#2b2b2b",
        //   secondary: "#284b63",
        //   tertiary: "#84a59d",
        //   highlight: "rgba(143, 159, 169, 0.15)",
        //   textHighlight: "#fff23688",
        // },
        lightMode: {
          dark: "#B18164", // titles
          light: "#F7F1ED", // background
          lightgray: "#ECD6C1", // searchbar
          darkgray: "#445150", // text, carrots, search bar text, 
          gray: "#B5A4AF", // Meta data - data, how long the read is etc
          secondary: "#75918E", // Site folder headers, links text, active page in graph color
          tertiary: "#DD9971", // link hover, non-activated page in graph color
          highlight: "#ECD6C0", // tag background color / link background color
          textHighlight: "#00EBD1",
        },
        // darkMode: {
        //   light: "#161618",
        //   lightgray: "#393639",
        //   gray: "#646464",
        //   darkgray: "#d4d4d4",
        //   dark: "#ebebec",
        //   secondary: "#7b97aa",
        //   tertiary: "rgba(255, 200, 255, 1)",
        //   highlight: "rgba(143, 159, 169, 0.15)",
        //   textHighlight: "#b3aa0288",
        // },
        darkMode: {
          dark: "#bc8d82", // Article Titles
          light: "#140c14", // bg
          lightgray: "#202024", // searchbar
          gray: "#363b60", // meta data
          darkgray: "#EDD5D2", // text, carrots, search bar text
          secondary: "#bc8d82", // site title, tag text color, folder headers
          tertiary: "#695fbe", // link hover, non-activated page in graph color
          highlight: "#202024", //  tag background color / link background color
          textHighlight: "#695fbe", // ???
        },
        // darkMode: {
        //   dark: "#347967", // titles
        //   light: "#1A1F23", // bg
        //   lightgray: "#21262A", // searchbar
        //   gray: "#404946", // meta data
        //   darkgray: "#95ABBC", // text, carrots, search bar text
        //   secondary: "#AF8579", // site title, tag color, folder headers
        //   tertiary: "#FEC5B6",
        //   highlight: "rgba(143, 159, 169, 0.15)",
        //   textHighlight: "#b3aa0288",
        // },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["git"],
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [
      Plugin.ExplicitPublish(),
      // Plugin.RemoveDrafts()
    ],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
