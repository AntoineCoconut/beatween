export default class Track {

  constructor(node, audioContext, player){
    this.player = player;
    this.solo = false;
    this.node = node;
    this.url = node.dataset.url;
    this.name = node.dataset.name;
    this.user = node.dataset.user;
    this.canvas = node.querySelector('canvas');
    this.audioContext = audioContext;
    this.nodeGain = audioContext.createGain();
    this.source;
    this.status = 'stop'
  }

  load(){
    fetch(this.url)
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((buffer) => {
      this.audioContext.decodeAudioData(buffer, (decoded) => {
        this.buffer = decoded;
        this.decode();
        this.player.loading();
        this.display();
      })
    })
  }

  decode(){
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.nodeGain);
    this.nodeGain.connect(this.audioContext.destination);
  }

  display(){
    const muteBtn = this.node.querySelector('.mute')
    muteBtn.addEventListener('click', (event) => {
      this.mute(muteBtn);
      event.currentTarget.classList.toggle('mute-on')
    })
    const soloBtn = this.node.querySelector('.solo')
    soloBtn.addEventListener('click', (event) => {
      event.currentTarget.classList.toggle('solo-on');
      this.isolate();
    })
    this.displayBuffer(this.source.buffer)
  }

  play(time, offset){
    this.source.start(time, offset);
  }

  stop(time){
    this.source.stop(time)
  }

  mute(element){
    if (this.nodeGain.gain.value === 1) {
      this.nodeGain.gain.value = 0
      element.innerHTML = '<i class="fas fa-volume-off"></i>'
    } else {
      this.nodeGain.gain.value = 1
      element.innerHTML = '<i class="fas fa-volume-up"></i>'
    };
  }

  isolate(){
    this.player.isolate(this);
  }

  displayBuffer(buff) {
    const canvas = this.canvas
    const context = canvas.getContext('2d')
    var drawLines = 5000;
    var leftChannel = buff.getChannelData(0); // Float32Array describing left channel
    var lineOpacity = 800 / leftChannel.length  ;
    context.save();
    context.fillStyle = 'rgba(0,0,0,0)' ;
    context.fillRect(0,0,100,75 );
    if (this.user === "true") {
      context.strokeStyle = '#6900ff';
    } else {
      context.strokeStyle = '#FF1654';
    };
    context.globalCompositeOperation = 'lighter';
    context.translate(0,75 / 2);
    context.globalAlpha = 1 ; // lineOpacity ;
    context.lineWidth=2;
    var totallength = leftChannel.length;
    var eachBlock = Math.floor(totallength / drawLines);
    var lineGap = (700/drawLines);

    context.beginPath();
    for(var i=0;i<=drawLines;i++){
      var audioBuffKey = Math.floor(eachBlock * i);
       var x = i*lineGap;
       var y = leftChannel[audioBuffKey] * 50 / 2;
       context.moveTo( x, y );
       context.lineTo( x, (y*-1) );
    }
    context.stroke();
    context.restore();
  }
}


