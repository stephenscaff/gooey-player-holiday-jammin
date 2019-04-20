import Utils from '../../components/Utils.js'
import WhoDis from '../../components/WhoDis/WhoDis.js'

/**
 * Goo Player
 * Handles playlist logic and Gooey audio vis.
 *
 * v2 slightly modified to handle Chrome 71's audio context autoplay changes
 * with strict user interactino reqs. Solution was to resume audiocontext within
 * our play/pause click handler via  audioContext.resume().
 * @see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
 *
 * Note, vis is gooey on Chrome/Firefox.
 * Vis works but no gooey on Edge.
 * Disabled vis on Safari and mobile.
 * Kick rocks IE11 and down.
 */
const GooPlayer = (() => {

  /**
   * AudioContext
   * Moved outside of context() method to better deal
   * with Chrome 71 audio context/api updates.
   */
  var audioContext = new(window.AudioContext || window.webkitAudioContext)

  let config;
  let context;
  let hasNoAudioAPI = WhoDis.noAudioAPI()

  return {

    /**
     * Config/Settings/Vars
     */
    config() {
      return {
        audio:       document.querySelector('#js-audio'),
        playBtn:     document.querySelector('.js-play'),
        peeps:       document.querySelectorAll('.js-peep'),
        peepImg:     document.querySelectorAll('.playlist-peep__img'),
        songTitle:   document.querySelector('.js-song-title'),
        songArtist:  document.querySelector('.js-song-artist'),
        currentSong: 0,
        raf:         null,
        bars:        [],
        isPlaying:   false
      }
    },

    context() {
      return {
        source:   audioContext.createMediaElementSource(config.audio),
        analyser: audioContext.createAnalyser()
      }
    },

    /**
     * Init
     */
    init() {
      config = this.config()
      if (!hasNoAudioAPI) context = this.context()
      this.bindEvents()
    },

    /**
     * Bind Events
     */
    bindEvents() {
      GooPlayer.loadFirstSong()
      GooPlayer.handleClick()

      if (!hasNoAudioAPI) {
        GooPlayer.connectAnalyser()
        GooPlayer.setupEqualizer()
        GooPlayer.audioListeners()
      }
    },

    /**
     * Handle Peeps/Tracks Click Events
     * Primary click handler for audio user interaction req.
     * @see js/components/_utils.js - forEach() helper
     */
    handleClick() {

      Utils.forEach ( config.peeps, function (index, peep) {

        peep.addEventListener('click', function(e) {
          e.preventDefault()
          let song = GooPlayer.getSong(index)
          config.audio.src = song.src

          GooPlayer.setSongInfo(song.title, song.artist)
          GooPlayer.playPause(e.currentTarget, config.peeps)
        })
      })
    },


    /**
     * Load First Song
     * Kick off playlist by loading up first track in peeps array.
     */
    loadFirstSong() {
      let song = GooPlayer.getSong(0)
      config.audio.src = song.src
      config.audio.load()
      GooPlayer.setSongInfo(song.title, song.artist)
    },

    /**
     * Get Song
     * Helper to set current song index and return song info
     * from the peep's data attributes. Sets currentSong Index and returns
     * an object with song url, title, artist
     * $param {number} index of peeps array.
     * @return {object}
     */
    getSong(index) {
      let song = config.peeps[index].dataset
      // Set currentSong
      config.currentSong = index

      return {
        src:    song.songSrc,
        title:  song.songTitle,
        artist: song.songArtist
      }
    },

    /**
     * Set Song Info
     * Sets song title/artist info in player, via object values returned with getSong() helper.
     * @param {string} Title
     * @param {string} Artist
     */
    setSongInfo(title, artist) {
      config.songTitle.innerHTML = title
      config.songArtist.innerHTML = artist
    },

    /**
     * Play Pause
     * Play clicked track if not already playing.
     * If already playing, pause. Play next track on click.
     * Add / remove active classes.
     * @since v1.2 - using audioContext.resume
     */
    playPause(el, group) {
      audioContext.resume() // Critical for Chrome 71
      config.audio.load()

      if ( Utils.hasClass(el, 'is-playing') ) {
        config.isPlaying = true
      } else {
        config.isPlaying = false
      }

      if (config.isPlaying){
        GooPlayer.pause()
      } else {
        GooPlayer.play()
      }
    },

    /**
     * Audio Event Listeners
     * Using audio event listeners to trigger our
     * play/pause/next methods. Make sure to watch these
     * in relation to new audio api updates in chrome 72
     */
    audioListeners() {

      // On Play Listener
      config.audio.onplay = function() {
        GooPlayer.play()
      }

      // On Pause
      config.audio.onpause = function() {
        GooPlayer.pause()
      }

      // On Ended
      config.audio.onended = function() {
        GooPlayer.next()
      }
    },

    /**
     * Play
     * Adds 'is-playing' class, starts MusicEqualizer
     */
    play() {
      let active = document.querySelector('.is-playing')

      if (active) {
        active.classList.remove('is-playing')
      }

      config.peeps[config.currentSong].classList.add('is-playing')
      // For plays tracking via GTM
      config.peeps[config.currentSong].querySelector('.playlist-peep__img').classList.add('is-on')
      config.audio.play()
      config.isPlaying = true

      if (!hasNoAudioAPI) GooPlayer.startEqualizer()
    },

    /**
     * Pause
     * Removes 'is-playing' class, pauses audio.
     */
    pause() {
      config.peeps[config.currentSong].classList.remove('is-playing')
      // For plays tracking via GTM
      document.querySelector('.playlist-peep__img.is-on').classList.remove('is-on')
      config.audio.pause()
      config.isPlaying = false

      // Give vis a sec to drop off
      setTimeout(function(){
        GooPlayer.stopEqualizer()
      }, 400)
    },

    /**
     * Next Song
     */
    next() {
      let nextSong = config.currentSong + 1
      let song = GooPlayer.getSong(nextSong)
      let nextPeep = config.peeps[nextSong]

      config.audio.src = song.src
      config.audio.load()

      GooPlayer.setSongInfo(song.title, song.artist)
      GooPlayer.playPause(nextPeep, config.peeps)
    },

    /**
     * Previous song
     */
    prev() {
      let nextSong = config.currentSong - 1
      let song = GooPlayer.getSong(nextSong)
      let nextPeep = config.peeps[nextSong]

      config.audio.src = song.src
      config.audio.load()

      GooPlayer.setSongInfo(song.title, song.artist)
      GooPlayer.playPause(nextPeep, config.peeps)
    },

    /**
     * Connect Audio source to analyser
     * Creates analyser node, connects audio source
     * creates output of frequency data as fftSize array
     * which we use to create Equalizer animation of
     * y Axis transforms.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
     */
    connectAnalyser() {

      if (hasNoAudioAPI) return

      context.source.connect(context.analyser)
      window.analyser = config.analyser
      context.analyser.connect(audioContext.destination)
      context.analyser.fftSize = 1024
      context.analyser.smoothingTimeConstant = 0.89
    },

    /**
     * Setup Equalizer Equalization Bars
     */
    setupEqualizer() {

      if (hasNoAudioAPI) return

      for (let i = 1; i <= 100; i++) {
        config.bars.push(document.getElementById('bar-' + i))
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

      if (hasNoAudioAPI) return

      let bufferLength = context.analyser.frequencyBinCount
      let frequencyData = new Uint8Array(bufferLength)
      context.analyser.getByteFrequencyData(frequencyData)

      let barcc = 0
      let numberOfBars = 100

      for (let i = 1; i < numberOfBars * 2; i += 1) {
        let y = frequencyData[i]

        barcc++

        if (barcc > numberOfBars) {
          barcc = 0
        }

        let bar = config.bars[barcc]

        if (bar) {
          bar.style.transform = 'translateY(-' + y + 'px)'
        }
      }
      // Recursive raf loop call
      config.raf = requestAnimationFrame(GooPlayer.startEqualizer)
    },

    /**
     * Stop Equalizer
     */
    stopEqualizer() {

      if (hasNoAudioAPI) return

      cancelAnimationFrame(config.raf)
    },
  }
})()

export default GooPlayer
