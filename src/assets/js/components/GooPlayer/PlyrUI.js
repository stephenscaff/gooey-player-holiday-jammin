import Plyr from 'plyr';

/**
 * Player UI
 * Inits plyr instances and adds custom Player UI
 */
const PlyrUI = (() => {

  /**
   * Audio Instance
   * Replaces default audio player with Plyr instance
   */
  var audioEl = '.js-audio'

  return {

    /**
     * Init Player, pass in custom controls
     */
    init() {
      const controls = this.controls()
      const player = new Plyr(audioEl, { controls: controls })
    },

    /**
     * Controls UI
     */
    controls() {
      return '\n      <section class="plyr__controls">\n        <div class="plyr__song-info">\n          <span class="plyr__song-name js-song-title"></span>\n          <span class="plyr__song-artist js-song-artist"></span>\n        </div>\n\n        <div class="plyr__utils">\n          <button type="button" class="plyr__control" data-plyr="restart">\n              <svg role="presentation"><use xlink:href="#plyr-restart"></use></svg>\n              <span class="plyr__tooltip" role="tooltip">Restart</span>\n          </button>\n\n          <button type="button" class="plyr__control" data-plyr="rewind">\n            <svg role="presentation"><use xlink:href="#plyr-rewind"></use></svg>\n            <span class="plyr__tooltip" role="tooltip">Rewind {seektime} secs</span>\n          </button>\n          <button type="button" class="plyr__control js-play" aria-label="Play, {title}" data-plyr="play">\n            <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>\n            <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>\n            <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>\n            <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>\n          </button>\n          <button type="button" class="plyr__control" data-plyr="fast-forward">\n            <svg role="presentation"><use xlink:href="#plyr-fast-forward"></use></svg>\n            <span class="plyr__tooltip" role="tooltip">Forward {seektime} secs</span>\n          </button>\n\n\n\n          <div class="plyr__progress">\n            <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">\n            <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>\n            <span role="tooltip" class="plyr__tooltip">00:00</span>\n          </div>\n          <div class="plyr__times">\n            <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>\n            <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>\n          </div>\n          </div>\n          <div class="plyr__sounds">\n            <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">\n              <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>\n              <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>\n              <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>\n              <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>\n            </button>\n\n            <div class="plyr__volume">\n              <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">\n            </div>\n          </div>\n      </section>\n';
    },
  }
})()

export default PlyrUI
