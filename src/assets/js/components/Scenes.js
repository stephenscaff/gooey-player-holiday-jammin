import Utils from '../components/Utils.js'
import anime from 'animejs/lib/anime.js'

/**
 * Scenes
 * Handles intro/exit of 'scenes' / full viewport sections
 * via data attribute on link el that refs scene id.
 * Includes Gooey SVG path animation via Anime.js
 *
 * @author stephen scaff
 */
const Scenes = (() => {

  let html = 			document.querySelector('html')
  let sceneLinks = 	document.querySelectorAll('[data-scene]')
  let exitLinks = 	document.querySelectorAll('.js-exit-scene')
	let welcomeScene = document.querySelectorAll('#scene-welcome')
	let playlistScene = document.querySelectorAll('#scene-playlist')
	let shareScene = document.querySelectorAll('#scene-share')
	let isOpen = 			false

  return{

    /**
     * Init
     */
    init(){
      this.bindEvents()
    },

    /**
     * Bind Events
     */
    bindEvents() {
			Scenes.welcomeExit()
			Scenes.handleClicks()
    },

    /**
     * Handle Click Events
     */
		handleClicks() {
			Utils.forEach ( sceneLinks, function (index, sceneLink) {

        // Main Click to Open Event
        sceneLink.addEventListener('click', function(e) {
          e.preventDefault()
          let targetScene = sceneLink.dataset.scene
          let targetSceneId = document.querySelector('#' + targetScene)
					let goo = Scenes.getGoo(targetSceneId)

          if (isOpen !== true) {
            Scenes.enter(sceneLink, targetSceneId, goo)
          }

          if (isOpen == true) {
            Scenes.exit(sceneLink, targetSceneId, goo)
          }

          // Manual Click exit
          Utils.forEach ( exitLinks, function (index, exitLink) {
            exitLink.addEventListener('click', function(e) {
              e.preventDefault()

              Scenes.exit(sceneLink, targetSceneId, goo)
            })
          })

          // Manual Esc exit
          window.onkeydown = (e) => {
            if (e.keyCode === 27) {
              Scenes.exit(sceneLink, targetSceneId, goo)
            }
          }
        })
      })
		},

    /**
     * Welcome Scene Exit
     */
		welcomeExit() {
			let scene =  document.querySelector('#scene-welcome')
			let exitLink = document.querySelector('.js-exit-welcome')
			let scenePlaylist = document.querySelector('#scene-playlist')
			let goo = Scenes.getGoo(scene)

			exitLink.addEventListener('click', function(){
				html.classList.add('welcome-is-exiting')

				var gooTransition = anime({
					targets: goo,
					duration: 1700,
					easing: 'easeInOutSine',
					d: goo.getAttribute('pathdata:id')
				})

				setTimeout(function(){
					window.scrollTo(0, 0)
					html.classList.remove('welcome-is-entered')
					scenePlaylist.classList.add('is-entered')
	      }, 400)
			})
		},

    /**
     * Open Drawer
     */
    enter(link, id, goo_path){
      html.classList.remove('scene-is-exited')
      html.classList.add('scene-is-entering')
      id.classList.remove('is-exited')
      id.classList.add('is-entered')
      link.classList.add('is-entered')

			Scenes.animateGooIn(goo_path)

      setTimeout(function(){
        html.classList.remove('scene-is-entering')
        html.classList.add('scene-is-entered')
        isOpen = true
      }, 200)
    },

    /**
     * exit
     */
    exit(link, id, goo_path){
      html.classList.add('scene-is-exiting')
			id.classList.add('is-exiting')

			Scenes.animateGooOut(goo_path)

      setTimeout(function(){
        html.classList.remove('scene-is-entered')
        id.classList.remove('is-entered')
        html.classList.remove('scene-is-exiting')
        html.classList.add('scene-is-exited')
        id.classList.add('is-exited')
        link.classList.remove('is-entered')
        isOpen = false
      }, 200)
    },

    /**
     * GetGooey
     * Helper to grab SVG element's path in scene
     */
		getGoo(el) {
			const shape = el.querySelector('.goo-layer-svg')
			const path = 	shape.querySelector('path')

			return path
		},

    /**
     * Animate Goo In
     * Animates path via pathdata:id within SVG returned via GetGoo()
     */
		animateGooIn(goo_path) {
			let gooTransition = anime({
				targets: goo_path,
				duration: 1000,
				delay: 100,
				easing: 'easeInOutSine',
				d: goo_path.getAttribute('pathdata:id')
			})
		},
    /**
     * Animate Goo Out
     * Animates path via pathdata:back within SVG returned via GetGoo()
     * pathdata:back is basically the returning state.
     */
		animateGooOut(goo_path) {
			let gooTransition = anime({
				targets: goo_path,
				duration: 1000,
				delay: 100,
				easing: 'easeInOutSine',
				d: goo_path.getAttribute('pathdata:back')
			})
		}
  }
 })()

export default Scenes
