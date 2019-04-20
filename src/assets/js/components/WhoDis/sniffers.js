import WhoDis from './WhoDis.js'


const html = document.querySelector('html')

if ( WhoDis.anyMobile() ) {
  document.addEventListener("touchstart", function(){}, true)
}

if ( WhoDis.Touch() ) {
  document.addEventListener("touchstart", function(){}, true)
}

if (WhoDis.IE10()) {
  document.documentElement.className+=' is-ie-10 ';
}

if ( WhoDis.anyMS() ) {
  html.classList.add('is-ms')
}

if ( WhoDis.IE() ) {
  document.documentElement.className+=' is-ie'
}

if (WhoDis.IE11()) {
  document.documentElement.className+=' is-ie-11 ';
}

if ( WhoDis.Edge() ) {
  html.classList.add('is-edge')
}

if ( WhoDis.anyModern() ) {
  html.classList.add('is-modern')
}

if (WhoDis.Goodie()) {
  html.classList.add('is-goodie');
}
