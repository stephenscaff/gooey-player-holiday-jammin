import peeps_data from './data.js'

/**
 * Render Peeps
 * Process our data into the HBS template to render the playlist peeps.
 */
const Peeps = (() => {

  let data = peeps_data;


  return {

    init: function() {
      this.bindEvents()
    },

    bindEvents: function() {
      Peeps.setContainer(data)
    },

    /**
     * Compile Tempalte
     * Compiles our hbs templatea to our data container,
     * calling our render method.
     * @param {obj} data - our data object of results within radius
     */
    setContainer: function(data) {
      var dataContainer = document.querySelector('#js-playlist-peeps')
      Peeps.render('assets/templates/playlist-peep.hbs', dataContainer, data)
    },

    /**
     * Render HBS Template to
     * Renders our hbs template with our data
     * @param {hbsTemplate} string - path to template
     * @param {renderEl} element - element to render to
     * @param {Object} data - data object
     */
    render: function(hbsTemplate, renderEl, data) {
      Peeps.getTemplate(hbsTemplate, function(template) {
        renderEl.insertAdjacentHTML('beforeend', template(data))
        window.dataIsReady = true
        //GooPlayer.init()
      });
    },

    /**
     * Get Template
     * Get's an external HBS template via ajax and compiles
     * with our data.
     * @param {string} path - path to our template file
     * @param {function} callback - our callback function to pass ajax response
     */
     getTemplate: function(path, callback) {
       let source, template;

       fetch(path)
        .then( function (response) {
          return response.text()
        })
        .then( function (data) {
          source = data;
          template = Handlebars.compile(source)
          if (callback) callback(template)
        })
        .catch( function(error) {
          console.log(error)
        })
    }
  }
})()

export default Peeps;
