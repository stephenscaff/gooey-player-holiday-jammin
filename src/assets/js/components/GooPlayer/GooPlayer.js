import Utils from '../../components/Utils.js'
import GooEqualizer from './GooEqualizer.js'

/**
 * GooPlayer
 * Handles the audio player and playlist logic
 * Calls GooEqualizer for audio vis animation
 * @author Stephen Scaff
 */
function GooPlayer () {
  this.audio       = document.querySelector('#js-audio')
  this.playBtn     = document.querySelector('.js-play')
  this.peeps       = document.querySelectorAll('.js-peep')
  this.peepImg     = document.querySelectorAll('.playlist-peep__img')
  this.songTitle   = document.querySelector('.js-song-title')
  this.songArtist  = document.querySelector('.js-song-artist')
  this.currentSong = 0
  this.isPlaying   = false
}

GooPlayer.prototype = {
  constructor : GooPlayer,

  /**
   * Init
   */
  init(){
    self = this
    this.loadFirstSong()
    this.audioListeners()
    this.handleClick()

    return true
  },

  /**
   * Handle Peeps/Tracks Click Events
   * Primary click handler for audio user interaction req.
   * @see js/components/_utils.js - forEach() helper
   */
  handleClick() {
    this.peeps.forEach((peep, i) => {
      peep.addEventListener('click', (e) => {
        e.preventDefault()

        let song = self.getSong(i)
        self.audio.src = song.src

        self.setSongInfo(song.title, song.artist)
        self.playPause(e.currentTarget, this.peeps)
        GooEqualizer.setup()
      })
    })
  },

  /**
   * Load First Song
   * Kick off playlist by loading up first track in peeps array.
   */
  loadFirstSong() {
    let song = this.getSong(0)
    this.audio.src = song.src
    this.audio.load()
    this.setSongInfo(song.title, song.artist)
  },

  /**
   * Get Song
   * Helper to set current song index and return song info
   * from the peep's data attributes. Sets currentSong Index and returns
   * an object with song url, title, artist
   * $param {number} index of peeps array.
   * @return {object}
   */
  getSong(i) {
    let song = this.peeps[i].dataset
    this.currentSong = i

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
    this.songTitle.innerHTML = title
    this.songArtist.innerHTML = artist
  },

  /**
   * Play Pause
   * Play clicked track if not already playing.
   * If already playing, pause. Play next track on click.
   * Add / remove active classes.
   * @since v1.2 - using audioContext.resume
   */
  playPause(el, group) {
    // audioContext.resume() // Critical for Chrome 71
    this.audio.load()

    if ( Utils.hasClass(el, 'is-playing') ) {
      this.isPlaying = true
    } else {
      this.isPlaying = false
    }

    if (this.isPlaying){
      this.pause()
    } else {
      this.play()
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
    this.audio.onplay = () => {
      this.play()
    }

    // On Pause
    this.audio.onpause = () => {
      this.pause()
    }

    // On Ended
    this.audio.onended = () => {
      this.next()
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
    this.peeps[this.currentSong].classList.add('is-playing')
    this.audio.play()
    this.isPlaying = true
    GooEqualizer.startEqualizer()
  },

  /**
   * Pause
   * Removes 'is-playing' class, pauses audio.
   */
  pause() {
    this.peeps[this.currentSong].classList.remove('is-playing')
    this.audio.pause()
    this.isPlaying = false

    // Give vis a sec to drop off
    setTimeout(function(){
      GooEqualizer.stopEqualizer()
    }, 400)
  },

  /**
   * Next Song
   */
  next() {
    let nextSong = this.currentSong + 1
    let song = this.getSong(nextSong)
    let nextPeep = this.peeps[nextSong]

    this.audio.src = song.src
    this.audio.load()

    this.setSongInfo(song.title, song.artist)
    this.playPause(nextPeep, this.peeps)
  },

  /**
   * Previous song
   */
  prev() {
    let nextSong = this.currentSong - 1
    let song = this.getSong(nextSong)
    let nextPeep = this.peeps[nextSong]

    this.audio.src = song.src
    this.audio.load()

    this.setSongInfo(song.title, song.artist)
    this.playPause(nextPeep, this.peeps)
  },
};


export default GooPlayer
