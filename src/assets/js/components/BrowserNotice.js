import Utils from '../components/Utils.js'
import WhoDis from '../components/WhoDis/WhoDis.js'

/**
 * Browser Notice
 * Tells homies that their browser is hella lame
 * via a little popup box.
 */
const BrowserNotice = (() => {

  //const badBrowser = WhoDis.BadBrowser()
  const html = document.documentElement
  const closeNotice = document.getElementById('js-close-browser-notice')

  return {

    init: function() {
      this.bindEvents()
    },

    bindEvents: function() {
      if (!WhoDis.BadBrowser()) return
      BrowserNotice.showPopup()
    },

    showPopup: function() {
      document.documentElement.className+=' browser-notice-is-active'
      html.className+=' browser-notice-is-active'

      closeNotice.addEventListener('click', function(){
        BrowserNotice.closePopup()
      })
    },

    closePopup: function() {

      html.className+=' browser-notice-is-closing'

      setTimeout(function(){
        html.className+=' browser-notice-is-closed'
        html.classList.add('browser-notice-is-closed')
        html.classList.remove('browser-notice-is-active')
        html.classList.remove('browser-notice-is-closing')
      }, 400)
    }
  }
})()

export default BrowserNotice
