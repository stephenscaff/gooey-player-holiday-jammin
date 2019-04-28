
/**
 * GooEqualizer
 * Connects audio source to analyzer node, so we can create
 * output of frequency data as fftSize array which we use to
 * create Equalizer animation of y Axis transforms.
 */
const GooEqualizer = (() => {

  // bail if browser lacks audioContext
  if (!window.AudioContext) return;

  const audio       = document.querySelector('#js-audio')
  let audioContext  = new(window.AudioContext || window.webkitAudioContext)
  let source        = audioContext.createMediaElementSource(audio)
  let analyser      = audioContext.createAnalyser()
  let bufferLength  = analyser.frequencyBinCount
  let frequencyData = new Uint8Array(bufferLength)
  let bars = []
  let raf

  return {

    setup() {
      this.connectAnalyser()
      this.setupEqualizer()
    },

    /**
     * Connect Audio source to analyser
     * Connects analyser node to audioContext
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
     */
    connectAnalyser() {
      source.connect(analyser)
      analyser.connect(audioContext.destination)
      analyser.fftSize = 1024
      // Adjust strength/speed of equalizer
      analyser.smoothingTimeConstant = 0.8
    },

    /**
     * Setup Equalizer Bars
     * Equalizer is a series of divs used to visulize audio source
     */
    setupEqualizer() {
      for (let i = 1; i <= 100; i++) {
        bars.push(document.getElementById('bar-' + i))
      }
    },

    /**
     * Start Equalizer
     * Animation loop(raf) converting feequencyData
     * to y axis transforms of our bars.
     * Contains recursive call to raf loop
     * @todo - improve CPU useage (consistently at 30%ish while playing)
     */
    startEqualizer() {
      analyser.getByteFrequencyData(frequencyData)
      let barsCount = 0
      let numberOfBars = 100

      for (let i = 1; i < numberOfBars * 2; i += 1) {
        let y = frequencyData[i]

        barsCount++

        if (barsCount > numberOfBars) {
          barsCount = 0
        }

        let bar = bars[barsCount]

        if (bar) {
          bar.style.transform = 'translateY(-' + y + 'px)'
        }
      }
      // Recursive raf loop call
      let raf = requestAnimationFrame(GooEqualizer.startEqualizer)
    },

    /**
     * Stop Equalizer
     */
    stopEqualizer() {
      cancelAnimationFrame(raf)
    }
  }
})()

export default GooEqualizer
