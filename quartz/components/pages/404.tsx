import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>404</h1>
      <p>{i18n(cfg.locale).pages.error.notFound}</p>
      <a href={baseDir}>{i18n(cfg.locale).pages.error.home}</a>
      <div>Ahh! Sorry I probably changed the name of this article and forgot to relink it. Feel free to let me know at elijahclimbs@gmail.com</div>
      <br></br>
      <div>If use what you see in the URL bar and plug it into the searchbar on the <a href = {baseDir}>homepage</a>, probably find it!</div>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
