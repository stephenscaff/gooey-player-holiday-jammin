import GooPlayer from './GooPlayer.js'
import Peeps from './Peeps.js'
import PlyrUI from './PlyrUI.js'

Peeps.init()
PlyrUI.init()

setTimeout(function(){
  let Goo = new GooPlayer();
  Goo.init();
}, 1200)
