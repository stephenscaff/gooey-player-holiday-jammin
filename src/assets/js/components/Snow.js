import Utils from '../components/Utils.js'
import WhoDis from '../components/WhoDis/WhoDis.js'
import anime from 'animejs/lib/anime.js'

/**
 * Snow ANimations
 * Uses anime.js to create a snow effect of provided svgs.
 * @todo - Lower CPU useage.
 */
const Snow = (() => {
	var snowflakes = document.querySelectorAll('.snow .snow__item')
	var killBtn = document.querySelector('.js-exit-welcome')

	return {

		init() {
      if (WhoDis.aboveMedMq()) this.bindEvents()
		},

		bindEvents() {
			this.fall()
			this.kill()
		},

		/**
		 * Falling Snow
		 * Loops through our snow elements,
		 * adds anime.js instance with randomized props.
		 * @todo - consolidate effect without loop, using anime.js
		 *				 internal raf loop. Couldn't get good ranomization
		 *				 out the box though.
		 */
		fall() {
			Utils.forEach ( snowflakes, function (i, snowflake) {

				var randomFlake = '.js-snow-item-'+ anime.random(1, snowflakes.length)

				window.snowflakee = anime({
					targets: randomFlake,
					//delay: function(el, i) { return i * 111.5},
					duration: anime.random(200,900) * 25,
					easing: 'easeInQuad',
					translateY: ['-20', '1500'],
					//translateX: ['10', '200'],
					translateX: [anime.random(20, 40), anime.random(200, -200)],
					//opacity:function() { return anime.random(0.1, 0.9)},
					scale:anime.random(0.65, 0.8),
					rotate: function() { return anime.random(-360,360) },
					loop: true,
				})
			})
		},

		/**
		 * Kill Snow
		 * anime.js baked in pause wouldn't work with our loop.
		 * So, let's just remove() snow els when clicking scene exit link.
		 */
		kill() {
			killBtn.addEventListener('click', function() {
				//snowflakes.classList.add('.fade-out')

				Utils.forEach ( snowflakes, function (i, snowflake) {
					setTimeout(function(){
		        snowflake.remove()
		      }, 400)
				})
			})
		},
	}
})()

export default Snow
