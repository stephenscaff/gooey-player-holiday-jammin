# Holiday Jammin

## GreenRubino's 2018 Holiday Site on that Jammy hotness ya'll

[HolidayJammin.com](https://www.holidayjammin.com)

A holiday site for GR featuring employee created holiday playlist, with custom player and some Gooey vis leveraging the audio / audioContext api.

![Holiday Jammin Audio Vis](https://cdn.dribbble.com/users/286354/screenshots/6215563/holiday-jam-records-interaction-3-dribbble.gif)

### Dependencies
- [Plyr.io](https://github.com/sampotts/plyr) : for audio controls normalization
- [Anime.js](http://animejs.com/) : for some animation help
- [Handlebars.js](http://animejs.com/) : For compiling of partials and client-side template.

### Features
- [Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) : for custom visualization of Audio API's Analyser node
- SVG filter primitives `feGaussianBlur` and `feComposite in2` for creating Gooey effect

### Run

Run `npm i -D` from the project. Everything builds out to a `dist` folder.


### Data

Data of employee and song info is created in a google doc and exported as JSON.
It's then included in `src/assets/js/components/_data.js` where it's saved as a var for use with a Handlebars partial.

HBS partial is located at `src/assets/templates/playlist-peep.hbs`

- Data File: `src/assets/js/components/_data.js`
- Peep Template: `src/assets/templates/playlist-peep.hbs`


### Scenes

This is a single page site, with 'Scenes' of full viewport content.
Scenes are `.hbs` partials located within `src/partials` and controlled via some
js found in `src/assets/js/components/_scenes.js`

Scenes Include:

- Welcome: First scene on load, with snow animation (`partials/scene-welcome`)
- Playlist: Actual playlist and player scene (`partials/scene-playlist`)
- Share: Share scene (`partials/scene-share`)


### Audio Vis

We're using the Audio and AudioContext api to visualize frequency data.

`GooPlayer.js` (`components/js/GooPlayer`) handles the actual playlist logic and audio vis.

Essentially, with extract frequency data from our audio source using the `AnalyserNode`, which is created using the `AudioContext.createAnalyser()` method.

For example, first we define out AudioContext

```
var audioContext = new(window.AudioContext || window.webkitAudioContext);
```

Then we connect an analyser node

```
audioContext.createMediaElementSource(config.audio),
audioContext.createAnalyser()
```

This Analyser node is then connected to our audio source, in between our source and destination, so we can
capture audio data using a `Fast Fourier Transform (fft)`, which outputs a big ass array of frequency data that we then use to animate y axis transforms of our equalizer (just a bunch of divs).
(see `connectAnalyser` method in `goo-player.js`)

```
source.connect(analyser);
window.analyser = analyser;
analyser.connect(audioContext.destination);
analyser.fftSize = 1024;
analyser.smoothingTimeConstant = 0.89;
```

An SVG Filter is then used to create that gooey effect where available.

- [Nice MDN resource about visualizing audio api]('https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API')


### Gooey

Gooey animation is achieved via SVG filters.

Specifically SVG filter primitives `feGaussianBlur` and `feComposite in2` :
```
<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"/>
<feComposite in="SourceGraphic" in2="goo" operator="atop"/>
```

- [More on `feGaussianBlur`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur)
- [More on `feComposite`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComposite)
