import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    // return (<footer class={`${displayClass ?? ""}`}>
    //   <ul>
    //   <li>
    //       <a href="https://elijahkennedy.com/">Code Portfolio</a>
    //     </li> |
    //     <li>
    //       <a href="https://app.milanote.com/1R4bQg1yx7aY2T/portfolio?p=waxm3Jjmsfr">Art Portfolio</a>
    //     </li> |
    //     <li>
    //       <a href="https://www.youtube.com/@elijah_thornberry">Youtube</a>
    //     </li> |
    //     <li>
    //       {/* Made with:{" "} */}
    //       {i18n(cfg.locale).components.footer.createdWith}{" "}
    //       <a href="https://quartz.jzhao.xyz/">Quartz</a>
    //       {/* <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year} */}
    //     </li>
    //   </ul>
    // </footer>)
    
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        {/* <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
        </p> */}
        <p>Big shout-out to<a href="https://noahlk.medium.com/"> Noah Kennedy </a> and <a href="https://quartz.jzhao.xyz/">Quartz4</a> for making this blog possible.</p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
