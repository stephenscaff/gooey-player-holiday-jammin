import GooPlayer from './GooPlayer.js'
import Peeps from './Peeps.js'
import PlyrUI from './PlyrUI.js'

Peeps.init()

PlyrUI.init()



setTimeout(function(){
  GooPlayer.init()
}, 1200)
