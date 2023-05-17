import { tag, createStyleLink, unhide } from "framework"
import { dev } from "config"

class Layout extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: "open"})

    this.shadowRoot.appendChild(this.styleLink)
    this.shadowRoot.appendChild(this.header)
    this.shadowRoot.appendChild(this.screen)
    this.shadowRoot.appendChild(this.main)
    this.shadowRoot.appendChild(this.footer)

    this.styleLink.addEventListener("load", (_) => {
      unhide(...[dev && this.screen, this.main, this.footer])
    })

    // Fix page height for mobile Safari.
    // Doing this in CSS doesn't work as Chrome matches it also.
    // https://allthingssmitty.com/2020/05/11/css-fix-for-100vh-in-mobile-webkit
    if (this.isMobileSafari()) {
      this.shadowRoot.appendChild(tag("style", ":host { min-height: -webkit-fill-available; }"))
    }

    this.updateScreenDebugInfo()
  }

  connectedCallback() {
    window.addEventListener("resize", e => this.updateScreenDebugInfo())
  }

  get styleLink() {
    return this._style ||= createStyleLink("components/layout/layout.css")
  }

  get screen() {
    return this._screen ||= tag("div", {id: "screen", style: {display: "none"}})
  }

  get header() {
    return this._header ||= tag("bm-header")
  }

  #main
  get main() {
    return this.#main ||= tag("main", {style: {display: "none"}}, tag("slot"))
  }

  #footer
  get footer() {
    return this.#footer ||= tag("bm-footer", {style: {display: "none"}})
  }

  isMobileSafari() {
    const ua = window.navigator.userAgent
    return ua.match(/iPhone|iPad/i) && ua.match(/WebKit/i) && !ua.match(/CriOS/i)
  }

  #screenDebugInfo() {
    return [`${this.isMobileSafari() ? "(i)" : ""}${this.screenSize()[0]}`,
            `${window.innerWidth}x${window.innerHeight}`,
            `(${window.devicePixelRatio})`]
  }

  updateScreenDebugInfo() {
    if (dev) {
      this.screen.innerHTML = this.#screenDebugInfo().join(" ")
    }
  }

  screenSize() {
    return Object.entries({XS: 600, SM: 900}).find(([ _, breakpoint ]) =>
      window.matchMedia(`(max-width: ${breakpoint}px)`).matches
    ) || ["LG", 1200]
  }
}

customElements.define("bm-layout", Layout)

// Import map doesn't work with import().
// Doesn't it? It most definitely should based on the docs.
import("../header/header.js")
import("../footer/footer.js")
