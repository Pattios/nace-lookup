import { tag, createStyleLink } from "framework"

class SearchResults extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: "open"})
    this.shadowRoot.appendChild(this.style)
    this.shadowRoot.appendChild(this.results)
  }

  get style() {
    return this._style ||= createStyleLink("components/search-results/search-results.css")
  }

  get results() {
    return this._results ||= tag("div", {id: "results"})
  }

  showResults(items, term) {
    this.results.replaceChildren(...
      items.reduce((elements, { label, items }) => {
        elements.push(tag("div", {className: "l4-item"} , label))
        items.forEach(({ code, label }) => {
          elements.push(tag("div", {className: "l6-item"}, [
            tag("span", {className: "code"}, code),
            tag("span", {className: "label"}, this.#highlight(label, term))
          ]))
        })

        return elements
      }, [])
    )
  }

  showError() {
    this.results.replaceChildren(
      tag("div", {id: "error"}, [
        tag("h3", "Error"),
        tag("p", "An unexpected error occurred. We'd be very thankful if you could write us to EMAIL and let us know. Thank you!")
      ])
    )
  }

  #highlight(label, term) {
    return label.replace(
      new RegExp(`\\b${term}`, "i"),
        `<span class="highlight">${term}</span>`)
  }
}

customElements.define("search-results", SearchResults)

import("../modal/modal.js")