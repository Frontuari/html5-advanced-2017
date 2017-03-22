class Video{
	constructor(selector){
		this.selector = selector;
		this.playerElement = document.querySelector(selector);
		this.videoElement = document.querySelector(selector+" video");

		this.bindEvents();
	}

	bindEvents(){
		this.playPauseBtn = document.querySelector(this.selector+" .play-pause");
		this.showVolumeBtn = document.querySelector(this.selector+" .show-volume");
		this.volumeSlider = document.querySelector(this.selector+" #volume-slider");
		this.progressBar = document.querySelector(this.selector+" .bar");
		this.fullScreenBtn = document.querySelector(this.selector+" .set-full-screen");
		this.showSpeedBtn = document.querySelector(this.selector+" .show-speed");
		this.playBackRateBtns = document.querySelectorAll(this.selector+" .playBackRate");
		this.progressContainerBar = document.querySelector(this.selector+" .progress");

		this.playPauseBtn.addEventListener('click',()=>this.playPause());
		this.showVolumeBtn.addEventListener('click',()=>this.toggleSlide(' .volume'));
		this.volumeSlider.addEventListener('input',()=>this.updateVolume());
		this.videoElement.addEventListener('timeupdate',()=>this.updateProgress());
		this.videoElement.addEventListener('durationchange',()=>this.setFullDuration());
		this.fullScreenBtn.addEventListener('click',()=>this.setFullScreen());
		this.showSpeedBtn.addEventListener('click',()=>this.toggleSlide(' .speed'));
		this.progressContainerBar.addEventListener('click',(ev)=>this.setDuration(ev));

		this.playBackRateBtns.forEach((el)=>{
			el.addEventListener('click',()=>this.setPlayBackRate(el));
		});
	}

	playPause(){
		if(this.videoElement.paused){
			this.videoElement.play();
			this.playPauseBtn.innerHTML = "pause";
		}
		else{
			this.videoElement.pause();
			this.playPauseBtn.innerHTML = "play_arrow";	
		}
	}

	toggleSlide(selector){
		document.querySelector(this.selector+selector).classList.toggle('active');
	}

	updateVolume(){
		if(this.volumeSlider.value == 0){
			this.showVolumeBtn.innerHTML = "volume_mute";
		}
		else if(this.volumeSlider.value < 0.5){
			this.showVolumeBtn.innerHTML = "volume_down";
		}
		else{
			this.showVolumeBtn.innerHTML = "volume_up";	
		}

		this.videoElement.volume = this.volumeSlider.value;
	}

	updateProgress(){
		let currentTime = this.videoElement.currentTime;
		let fullTime = this.videoElement.duration;

		let percentage = (currentTime * 100) / fullTime;

		this.setTime(currentTime,".current-duration");

		this.progressBar.style.width = percentage+"%";
	}

	setFullDuration(){
		this.setTime(this.videoElement.duration,".full-duration");
	}

	setTime(duration,selector){
		let minutes = parseInt(duration / 60, 10);
		let seconds = parseInt(duration % 60);

		minutes = (minutes < 10) ? "0"+minutes : minutes;
		seconds = (seconds < 10) ? "0"+seconds : seconds;

		document.querySelector(this.selector+" "+selector).innerHTML = minutes+":"+seconds;
	}

	setFullScreen(){
		let fullScreenFunction = this.videoElement.requestFullscreen || 
								this.videoElement.webkitRequestFullScreen ||
								this.videoElement.mozRequestFullScreen ||
								this.videoElement.msRequestFullscreen;

		fullScreenFunction.call(this.videoElement);
	}

	setPlayBackRate(el){
		let speed = parseFloat(el.dataset.value);

		this.videoElement.playbackRate = speed;

		this.toggleSlide(' .speed');
	}

	setDuration(e){
		let el = e.currentTarget;

		let positions = getRelativeCoordinates(e,el);
		let fullWidth = el.offsetWidth;

		let percentage = positions.x / fullWidth;

		let time = this.videoElement.duration * percentage;

		this.videoElement.currentTime = time;
	}
}

function getRelativeCoordinates(e,container){
	let pos = {}, offset = {}, ref;

	ref = container.offsetParent;

	pos.x = !! e.touches ? e.touches[ 0 ].pageX : e.pageX;
	pos.y = !! e.touches ? e.touches[ 0 ].pageY : e.pageY;

	offset.left = container.offsetLeft;
	offset.top = container.offsetTop;

	while( ref ){
		offset.left += ref.offsetLeft;
		offset.top += ref.offsetTop;

		ref = ref.offsetParent;
	}

	return {
		x: pos.x - offset.left,
		y: pos.y - offset.top
	}
}