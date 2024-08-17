import { FilePath, FullSlug, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"

// @ts-ignore
import spaRouterScript from "../../components/scripts/spa.inline"
// @ts-ignore
import popoverScript from "../../components/scripts/popover.inline"
import styles from "../../styles/custom.scss"
import popoverStyle from "../../components/styles/popover.scss"
import { BuildCtx } from "../../util/ctx"
import { QuartzComponent } from "../../components/types"
import { googleFontHref, joinStyles } from "../../util/theme"
import { Features, transform } from "lightningcss"
import { transform as transpile } from "esbuild"
import { write } from "./helpers"
import DepGraph from "../../depgraph"

type ComponentResources = {
  css: string[]
  beforeDOMLoaded: string[]
  afterDOMLoaded: string[]
}

function getComponentResources(ctx: BuildCtx): ComponentResources {
  const allComponents: Set<QuartzComponent> = new Set()
  for (const emitter of ctx.cfg.plugins.emitters) {
    const components = emitter.getQuartzComponents(ctx)
    for (const component of components) {
      allComponents.add(component)
    }
  }

  const componentResources = {
    css: new Set<string>(),
    beforeDOMLoaded: new Set<string>(),
    afterDOMLoaded: new Set<string>(),
  }

  for (const component of allComponents) {
    const { css, beforeDOMLoaded, afterDOMLoaded } = component
    if (css) {
      componentResources.css.add(css)
    }
    if (beforeDOMLoaded) {
      componentResources.beforeDOMLoaded.add(beforeDOMLoaded)
    }
    if (afterDOMLoaded) {
      componentResources.afterDOMLoaded.add(afterDOMLoaded)
    }
  }

  return {
    css: [...componentResources.css],
    beforeDOMLoaded: [...componentResources.beforeDOMLoaded],
    afterDOMLoaded: [...componentResources.afterDOMLoaded],
  }
}

async function joinScripts(scripts: string[]): Promise<string> {
  // wrap with iife to prevent scope collision
  const script = scripts.map((script) => `(function () {${script}})();`).join("\n")

  // minify with esbuild
  const res = await transpile(script, {
    minify: true,
  })

  return res.code
}

function addGlobalPageResources(ctx: BuildCtx, componentResources: ComponentResources) {
  const cfg = ctx.cfg.configuration

  // popovers
  if (cfg.enablePopovers) {
    componentResources.afterDOMLoaded.push(popoverScript)
    componentResources.css.push(popoverStyle)
  }

    
  for (let lytic of cfg.analytics ){

    if (lytic?.provider === "google") {
      const tagId = lytic.tagId
      componentResources.afterDOMLoaded.push(`
        if (window.location.hostname !== "localhost"){
          const gtagScript = document.createElement("script")
          gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=${tagId}"
          gtagScript.async = true
          document.head.appendChild(gtagScript)

          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag("js", new Date());
          gtag("config", "${tagId}", { send_page_view: false });

          document.addEventListener("nav", () => {
            gtag("event", "page_view", {
              page_title: document.title,
              page_location: location.href,
            });
          });
        }
      `)
    } else if (lytic?.provider === "plausible") {
      const plausibleHost = lytic.host ?? "https://plausible.io"
      componentResources.afterDOMLoaded.push(`
        if (window.location.hostname !== "localhost"){
          const plausibleScript = document.createElement("script")
          plausibleScript.src = "${plausibleHost}/js/script.manual.js"
          plausibleScript.setAttribute("data-domain", location.hostname)
          plausibleScript.defer = true
          document.head.appendChild(plausibleScript)

          window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

          document.addEventListener("nav", () => {
            plausible("pageview")
          })
        }
      `)
    } else if (lytic?.provider === "umami") {
      componentResources.afterDOMLoaded.push(`
        if (window.location.hostname !== "localhost"){
          const umamiScript = document.createElement("script")
          umamiScript.src = "${lytic.host ?? "https://analytics.umami.is"}/script.js"
          umamiScript.setAttribute("data-website-id", "${lytic.websiteId}")
          umamiScript.async = true

          document.head.appendChild(umamiScript)
        }
      `)
    } else if (lytic?.provider === "goatcounter") {
      componentResources.afterDOMLoaded.push(`
        if (window.location.hostname !== "localhost"){
          const goatcounterScript = document.createElement("script")
          goatcounterScript.src = "${lytic.scriptSrc ?? "https://gc.zgo.at/count.js"}"
          goatcounterScript.async = true
          goatcounterScript.setAttribute("data-goatcounter",
            "https://${lytic.websiteId}.${lytic.host ?? "goatcounter.com"}/count")
          document.head.appendChild(goatcounterScript)
        }
      `)
      } else if (lytic?.provider === "hotjar") {
        componentResources.afterDOMLoaded.push(`
          const hotJarScript = document.createElement("script")
          hotJarScript.innerHTML= (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${lytic.hjid},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `)
    } else if (lytic?.provider === "posthog") {
      componentResources.afterDOMLoaded.push(`
        const posthogScript = document.createElement("script")
        posthogScript.innerHTML= \`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('${lytic.apiKey}',{api_host:'${lytic.host ?? "https://app.posthog.com"}'})\`
        document.head.appendChild(posthogScript)
      `)
    } else if (lytic?.provider === "tinylytics") {
      const siteId = lytic.siteId
      componentResources.afterDOMLoaded.push(`
        const tinylyticsScript = document.createElement("script")
        tinylyticsScript.src = "https://tinylytics.app/embed/${siteId}.js"
        tinylyticsScript.defer = true
        document.head.appendChild(tinylyticsScript)
      `)
    } else if (lytic?.provider === "cabin") {
      componentResources.afterDOMLoaded.push(`
        const cabinScript = document.createElement("script")
        cabinScript.src = "${lytic.host ?? "https://scripts.cabin.dev"}/cabin.js"
        cabinScript.defer = true
        cabinScript.async = true
        document.head.appendChild(cabinScript)
      `)
    }

  }
}

if (cfg.enableSPA) {
  componentResources.afterDOMLoaded.push(spaRouterScript)
} else {
  componentResources.afterDOMLoaded.push(`
    window.spaNavigate = (url, _) => window.location.assign(url)
    window.addCleanup = () => {}
    const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
    document.dispatchEvent(event)
  `)
}

// This emitter should not update the `resources` parameter. If it does, partial
// rebuilds may not work as expected.
export const ComponentResources: QuartzEmitterPlugin = () => {
  return {
    name: "ComponentResources",
    getQuartzComponents() {
      return []
    },
    async getDependencyGraph(_ctx, _content, _resources) {
      return new DepGraph<FilePath>()
    },
    async emit(ctx, _content, _resources): Promise<FilePath[]> {
      const promises: Promise<FilePath>[] = []
      const cfg = ctx.cfg.configuration
      // component specific scripts and styles
      const componentResources = getComponentResources(ctx)
      let googleFontsStyleSheet = ""
      if (cfg.theme.fontOrigin === "local") {
        // let the user do it themselves in css
      } else if (cfg.theme.fontOrigin === "googleFonts" && !cfg.theme.cdnCaching) {
        // when cdnCaching is true, we link to google fonts in Head.tsx
        let match

        const fontSourceRegex = /url\((https:\/\/fonts.gstatic.com\/s\/[^)]+\.(woff2|ttf))\)/g

        googleFontsStyleSheet = await (
          await fetch(googleFontHref(ctx.cfg.configuration.theme))
        ).text()

        while ((match = fontSourceRegex.exec(googleFontsStyleSheet)) !== null) {
          // match[0] is the `url(path)`, match[1] is the `path`
          const url = match[1]
          // the static name of this file.
          const [filename, ext] = url.split("/").pop()!.split(".")

          googleFontsStyleSheet = googleFontsStyleSheet.replace(
            url,
            `https://${cfg.baseUrl}/static/fonts/${filename}.ttf`,
          )

          promises.push(
            fetch(url)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`Failed to fetch font`)
                }
                return res.arrayBuffer()
              })
              .then((buf) =>
                write({
                  ctx,
                  slug: joinSegments("static", "fonts", filename) as FullSlug,
                  ext: `.${ext}`,
                  content: Buffer.from(buf),
                }),
              ),
          )
        }
      }

      // important that this goes *after* component scripts
      // as the "nav" event gets triggered here and we should make sure
      // that everyone else had the chance to register a listener for it
      addGlobalPageResources(ctx, componentResources)

      const stylesheet = joinStyles(
        ctx.cfg.configuration.theme,
        googleFontsStyleSheet,
        ...componentResources.css,
        styles,
      )
      const [prescript, postscript] = await Promise.all([
        joinScripts(componentResources.beforeDOMLoaded),
        joinScripts(componentResources.afterDOMLoaded),
      ])

      promises.push(
        write({
          ctx,
          slug: "index" as FullSlug,
          ext: ".css",
          content: transform({
            filename: "index.css",
            code: Buffer.from(stylesheet),
            minify: true,
            targets: {
              safari: (15 << 16) | (6 << 8), // 15.6
              ios_saf: (15 << 16) | (6 << 8), // 15.6
              edge: 115 << 16,
              firefox: 102 << 16,
              chrome: 109 << 16,
            },
            include: Features.MediaQueries,
          }).code.toString(),
        }),
        write({
          ctx,
          slug: "prescript" as FullSlug,
          ext: ".js",
          content: prescript,
        }),
        write({
          ctx,
          slug: "postscript" as FullSlug,
          ext: ".js",
          content: postscript,
        }),
      )

      return await Promise.all(promises)
    },
  }
}
