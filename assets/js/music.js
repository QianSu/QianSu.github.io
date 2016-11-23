/* *
 * audio visualizer with html5 audio element
 *
 * v0.1.0
 *
 * licenced under the MIT license
 *
 * see my related repos:
 * - HTML5_Audio_Visualizer https://github.com/wayou/HTML5_Audio_Visualizer
 * - 3D_Audio_Spectrum_VIsualizer https://github.com/wayou/3D_Audio_Spectrum_VIsualizer
 * - selected https://github.com/wayou/selected
 * - MeowmeowPlayer https://github.com/wayou/MeowmeowPlayer
 *
 * reference: http://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
 */

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

window.onload = function() {
    var audio = document.getElementById('audio');
  var music=document.getElementById('music');
    try {
        var ctx = new AudioContext();
    } catch (e) {
        Console.log('!Your browser does not support AudioContext');
    }

    //创建获取频谱能量值的analyser节点。
    var audioSrc = ctx.createMediaElementSource(audio);
    var analyser = ctx.createAnalyser();
    // we have to connect the MediaElementSource with the analyser
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
    var canvas = document.getElementById('canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, //width of the meters in the spectrum
        gap = 2, //gap between meters
        capHeight = 2,
        capStyle = '#BE0B0B',
        meterNum = 800 / (10 + 2), //count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    ctx = canvas.getContext('2d'),
      gradient = ctx.createLinearGradient(0, 0, 0, 300);
     gradient.addColorStop(1, '#0f0');
     gradient.addColorStop(0.5, '#ff0');
     gradient.addColorStop(0, '#f00');
    //gradient.addColorStop(1, 'lightpink');
    //gradient.addColorStop(0.5, 'lightgreen');
    //gradient.addColorStop(0, 'lightblue');
    // loop
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum); //sample limited data from the total array
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;
            //draw the cap, with transition effect
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
            ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    // audio.play();
  //音乐播放控制
  var flag=true;
  music.onclick=function(){
    if(flag){
      audio.play();
      flag=false;
    }else{
      audio.pause();
      flag=true;
    }
  }
};
