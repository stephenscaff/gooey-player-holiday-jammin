/**
 * Handlebars Helpers for scorecards data
 * @author Stephen Scaff
 */
const HBSHelpers = (() => {

  return {

    /**
     * Init
     */
    init() {
      this.hbHelpers()
    },

    /**
     * Our Global HB Helpers
     */
    hbHelpers(){

      /**
       * Debug Helper
       * Logs debug info on object context
       */
      Handlebars.registerHelper('debug', function(optionalValue) {
        console.log('Current Context')
        console.log('====================')
        console.log(this)
      })

      /**
       * Remove HTML
       * Helper to strip out any html in our data response
       * @return {string}
       */
      Handlebars.registerHelper('removeHTML', function(str) {
        const formatedStr = str.replace(/<(?:.|\n)*?>/gm, '')
        return new Handlebars.SafeString(formatedStr)
      })

      /**
       * Make Lowecase
       * @return {string}
       */
      Handlebars.registerHelper('lowercase', function(str) {
        const formatedStr = str.toLowerCase()
        return new Handlebars.SafeString(formatedStr)
      })

      /**
       * Peep Name ID
       * Makes a nicely formated ID of a peeps first and last name,
       * Hyphenize first,last, remove whitepsaces, make lowercase.
       * For song usage tracking.
       * @return {string}
       */
      Handlebars.registerHelper('peepNameID', function(first, last) {
        const combine = first+'-'+last
        const noSpaces = combine.replace(/\s+/g, '')
        const lowercase = noSpaces.toLowerCase()

        return new Handlebars.SafeString(lowercase)
      })
    }
  }
})()

export default HBSHelpers
