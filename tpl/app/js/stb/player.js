/**
 * @module stb/ui/player
 * @author Aleynikov Boris <alynikov.boris@gmail.com>.
 */

'use strict';

/* eslint new-cap: 0 */

var app       = require('./app'),
	keys      = require('./keys'),
	Component = require('./component');


/**
 * Base player implementation.
 *
 * @constructor
 * @extends Component
 * @param {object} [config={}] init parameters
 */
function Player ( config ) {
	var self = this;

	/**
	 * State of playing flag
	 *
	 * @type {boolean}
	 */
	this.isPLaying = false;

	/**
	 * Play/pause condition
	 *
	 * @type {boolean}
	 */
	this.isPause = false;

	/**
	 * Total duration in format 00:00:00
	 *
	 * @type {string}
	 */
	this.totalDuration = '';

	/**
	 * Total duration in sec
	 *
	 * @type {number}
	 */
	this.totalDurationSec = 0;

	/**
	 * Current duration in format 00:00:00
	 *
	 * @type {string}
	 */
	this.currentTime = '';

	/**
	 * Current secs count
	 *
	 * @type {number}
	 */
	this.currentSec = 0;

	/**
	 * Rewind state information
	 *
	 * @type {{isActive: boolean, startTime: number, time: number, timeout: number}}
	 */
	this.rewindHelper = {
		isActive: false,
		startTime: 0,
		time: 0,
		timeout: 0,
		duration: undefined,
		timeoutDuration: false
	};

	/**
	 * Set mode information
	 *
	 * @type {{active: boolean, timeout: number, time: number, count: number, length: number, sec: number}}
	 */
	this.setModeHelper = {
		active: false,
		timeout: 0,
		time: 0,
		timeStr: '',
		count: 0,
		length: 0,
		sec: 0,
		timeoutDuration: 0
	};


	/**
	 * Audio PIDs array
	 *
	 * @type {Array}
	 */
	this.audioPIDs = [];

	/**
	 * Current audio PID
	 *
	 * @type {number}
	 */
	this.currentAudioPID = 0;

	/**
	 * Current active aspect
	 *
	 * @type {number}
	 */
	this.activeAspect = 0;

	/**
	 * Array of subtitle PIDs
	 *
	 * @type {Array}
	 */
	this.subtitlePIDs = [];

	/**
	 * Current subtitle PID
	 *
	 * @type {number}
	 */
	this.currentSubtitle = null;

	/**
	 * Current duration interval id
	 *
	 * @type {number}
	 */
	this.durationInterval = 0;

	/**
	 * Allow input content playback position with inputPosition function
	 *
	 * @type {boolean}
	 */
	this.allowInputPosition = true;

	// sanitize
	config = config || {};

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('player');

	// component setup
	this.init(config);

	// custom control method
	if ( config.control !== undefined ) {
		if ( DEBUG ) {
			if ( typeof config.control !== 'function' ) {
				throw 'wrong config.control type';
			}
		}
		// apply
		this.control = config.control;
	}

	// navigation by keyboard
	this.addListener('keydown', this.control);
	// media events listening and broadcasting events
	app.addListener('media', function ( event ) {
		Player.prototype.mediaListener.call(self, event);
	});

}


// inheritance
Player.prototype = Object.create(Component.prototype);
Player.prototype.constructor = Player;


// aspect types
Player.prototype.ASPECT_TYPE_FIT = 0x10;
Player.prototype.ASPECT_TYPE_BIG = 0x40;
Player.prototype.ASPECT_TYPE_OPTIMAL = 0x50;
Player.prototype.ASPECT_TYPE_ZOOM = 0x00;


// aspects array
Player.prototype.aspects = [
	{
		name: 'fit',
		mode: Player.prototype.ASPECT_TYPE_FIT
	},
	{
		name: 'big',
		mode: Player.prototype.ASPECT_TYPE_BIG
	},
	{
		name: 'opt',
		mode: Player.prototype.ASPECT_TYPE_OPTIMAL
	},
	{
		name: 'exp',
		mode: Player.prototype.ASPECT_TYPE_ZOOM
	}
];


// stereo mode types
Player.prototype.STEREO_MODE_OFF = 0;
Player.prototype.STEREO_MODE_OVER_UNDER = 1;
Player.prototype.STEREO_MODE_OVER_UNDER_HD = 2;
Player.prototype.STEREO_MODE_SIDE_BY_SIDE = 3;


// stereo modes array
Player.prototype.stereoModes = [
	{
		mode: Player.prototype.STEREO_MODE_OFF,
		name: 'Off'
	},
	{
		mode: Player.prototype.STEREO_MODE_OVER_UNDER,
		name: 'Over-Under'
	},
	{
		mode: Player.prototype.STEREO_MODE_OVER_UNDER_HD,
		name: 'Over-Under HD'
	},
	{
		mode: Player.prototype.STEREO_MODE_SIDE_BY_SIDE,
		name: 'Side-by-side'
	}
];


/**
 * Default method to control player according to pressed keys.
 *
 * @param {Event} event generated event source of pressed keys
 */
Player.prototype.controlDefault = function ( event ) {
	switch ( event.code ) {
		case keys.ok:
		case keys.playPause:
			this.playPause();
			break;
		case keys.stop:
			this.stop();
			break;
		case keys.forward:
		case keys.right:
			this.rewind(true);
			break;
		case keys.rewind:
		case keys.left:
			this.rewind(false);
			break;
		case keys.f4:
		case 117:
			this.nextAspect();
			break;
		case keys.f1:
			this.nextAudioTrack();
			break;
		case keys.f2:
			this.nextSubtitle();
			break;
		case keys.f3:
			this.nextViewMode();
			break;
		case 48:
		case 49:
		case 50:
		case 51:
		case 52:
		case 53:
		case 54:
		case 55:
		case 56:
		case 57:
		case 58:
			this.inputPosition(event.code);
			break;
	}
};


/**
 * Default function to listen media events.
 *
 * @param {number} event code
 */
Player.prototype.mediaListener = function ( event ) {
	var self = this,
		info = {},
		duration,
		currentTime,
		audioStr, subtitleStr;

	debug.log('Device event: ' + event.code);
	switch ( event.code ) {
		case app.EVENT_PLAYBACK_BEGIN :
			self.isPLaying = true;
			if ( self.durationInterval ) {
				clearInterval(self.durationInterval);
				self.durationInterval = 0;
			}
			self.durationInterval = setInterval(function () {
				self.currentSec = gSTB.GetPosTime();
				currentTime = self.parseTime(self.currentSec);
				self.currentTime = ( currentTime.hour > 0 ? currentTime.hour + ':' : '') + currentTime.min + ':' + currentTime.sec;
				self.emit('duration', {
					sec: self.currentSec,
					time: self.currentTime
				});
			}, 1000);
			break;
		case app.EVENT_GET_MEDIA_INFO :
			self.totalDurationSec = gSTB.GetMediaLen();
			if ( self.totalDurationSec > 3600 ) {
				self.setModeHelper.length = 6;
			} else {
				self.setModeHelper.length = 4;
			}
			duration = self.parseTime(gSTB.GetMediaLen());
			self.totalDuration = ( duration.hour > 0 ? duration.hour + ':' : '') + duration.min + ':' + duration.sec;
			info.totalDuration = self.totalDuration;
			info.totalDurationSec = self.totalDurationSec;
			try {
				audioStr = gSTB.GetAudioPIDs().replace(/pid:/g, '\"pid\":').replace(/lang:/g, '\"lang\":');
				self.audioPIDs = JSON.parse(audioStr);
			} catch ( e ) {
				debug.log('Cant take audio PIDs');
			}
			try {
				subtitleStr = gSTB.GetSubtitlePIDs().replace(/pid:/g, '\"pid\":').replace(/lang:/g, '\"lang\":');
				self.subtitlePIDs = JSON.parse(subtitleStr);
			} catch ( e ) {
				debug.log('Cant take Subtitles PIDs');
			}
			// audio PIDs
			self.currentAudioPID = 0;
			if ( self.audioPIDs[0].lang[0] !== '' ) {
				info.audioPid = self.audioPIDs[0].lang[0];
			} else {
				info.audioPid = undefined;
			}
			self.currentSubtitle = null;
			info.subtitles = null;
			info.stereoMode = {
				type: gSTB.Get3DConversionMode(),
				name: self.stereoModes[gSTB.Get3DConversionMode()].name
			};
			self.emit('get:info', info);
			break;
		case app.EVENT_CONTENT_ERROR :
			self.isPLaying = false;
			self.emit('content:error');
			break;
		case app.EVENT_END_OF_FILE:
			self.currentSec = self.totalDurationSec;
			self.isPLaying = false;
			self.emit('content:end');
			break;
		case app.EVENT_SUBTITLE_LOAD_ERROR :
			self.subtitlePIDs.pop();
			break;
	}
};


/**
 * Current active method to control player according to pressed keys.
 * Can be redefined to provide custom control.
 *
 * @type {function}
 */
Player.prototype.control = Player.prototype.controlDefault;


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
Player.prototype.init = function ( config ) {

	if ( DEBUG ) {
		if ( arguments.length !== 1 ) {
			throw 'wrong arguments number';
		}
		if ( typeof config !== 'object' ) {
			throw 'wrong config type';
		}
		if ( config.rewindTimeout && typeof config.rewindTimeout !== 'number' ) {
			throw 'wrong timeout type';
		}
		if ( config.inputPositionTimeout && typeof config.inputPositionTimeout !== 'number' ) {
			throw 'wrong timeout type';
		}
	}

	// allow input playback position
	if ( config.allowInputPosition ) {
		this.allowInputPosition = config.allowInputPosition;
	}

	// set default rewind duration
	if ( config.rewindDuration ) {
		this.rewindHelper.duration = config.rewindDuration;
	}

	if ( config.rewindTimeout ) {
		this.rewindHelper.timeoutDuration = config.rewindTimeout;
	}

	if ( config.inputPositionTimeout ) {
		this.setModeHelper.timeoutDuration = config.inputPositionTimeout;
	}

	// init gSTB player
	gSTB.InitPlayer();
	gSTB.SetAspect(0x10);
	gSTB.SetVideoControl(0);
	gSTB.SetVideoState(0);
	gSTB.SetMode(0);
	gSTB.SetWinAlphaLevel(0, 255);
	gSTB.SetWinAlphaLevel(1, 255);
	gSTB.SetPIG(1, 0, 0, 0);
	gSTB.Set3DConversionMode(0);
	gSTB.SetTopWin(0);

};


/**
 * Play media content from url.
 *
 * @param {string} url to play media content
 * @param {object} [config={}] parameters of playing
 * @param {string} [config.solution='auto'] solution of media content
 * @param {string} [config.position=''] position to play media content
 * @param {string} [config.proxy=''] proxy server url
 */
Player.prototype.play = function ( url, config ) {
	var solution, position;

	if ( DEBUG ) {
		if ( arguments.length < 1 ) {
			throw 'wrong arguments number';
		}
	}

	this.totalDurationSec = 0;
	this.currentSec = 0;

	config = config || {};

	if ( config.solution ) {
		solution = config.solution;
	} else {
		solution = 'auto';
	}
	position = '' || ' position:' + config.position;
	gSTB.Play(solution + ' ' + url + position, config.proxy);
};


/**
 * Wrapper of gSTB.Stop.
 */
Player.prototype.stop = function () {
	gSTB.Stop();
	clearInterval(this.durationInterval);
	this.isPLaying = false;
	this.isPause = false;
};


/**
 * Play/pause of playing content.
 */
Player.prototype.playPause = function () {
	if ( this.isPause ) {
		gSTB.Continue();
	} else {
		gSTB.Pause();
	}
	this.isPause = !this.isPause;
	this.emit('pause', {state: this.isPause});
};


/**
 * Rewind playing content.
 *
 * @param {boolean} forward or backward
 * @param {number} [duration=null] of time to rewind
 */
Player.prototype.rewind = function ( forward, duration ) {
	var self = this;

	if ( DEBUG ) {
		if ( arguments.length < 1 || typeof forward !== 'boolean' ) {
			throw 'wrong direction type';
		}
	}


	// set duration to 15 sec if not set
	duration = duration || this.rewindHelper.duration || 15;

	if ( !this.rewindHelper.isActive ) {
		this.rewindHelper.isActive = true;
		this.rewindHelper.startTime = this.currentSec;
		this.rewindHelper.time = this.currentSec;
		this.emit('rewind:start');
	}

	if ( forward ) {
		if ( this.rewindHelper.time + duration < this.totalDurationSec ) {
			this.rewindHelper.time += duration;
		} else {
			this.rewindHelper.time = this.totalDurationSec;
		}
	} else {
		if ( this.rewindHelper.time - duration > 0 ) {
			this.rewindHelper.time -= duration;
		} else {
			this.rewindHelper.time = 0;
		}
	}
	if ( this.rewindHelper.timeout ) {
		clearTimeout(this.rewindHelper.timeout);
	}
	this.emit('rewind', {time: this.rewindHelper.time, shift: this.rewindHelper.time - this.rewindHelper.startTime});

	// do gSTB.SetPosTime instantly if rewind timeout is not set
	if ( this.rewindHelper.timeoutDuration ) {
		this.rewindHelper.timeout = setTimeout(function () {
			// clear time parsing interval
			clearInterval(self.durationInterval);
			self.durationInterval = 0;
			self.rewindHelper.isActive = false;
			self.emit('rewind:apply');
			self.currentSec = self.rewindHelper.time;
			self.rewindHelper.timeout = 0;

			// emit end of content instantly without setting position to the end
			if ( self.rewindHelper.time === self.totalDurationSec ) {
				self.emit('content:end');
				return;
			}

			gSTB.SetPosTime(self.rewindHelper.time);

		}, this.rewindHelper.timeoutDuration);
	} else {
		// clear time pars interval
		clearInterval(self.durationInterval);
		self.durationInterval = 0;

		gSTB.SetPosTime(self.rewindHelper.time);
		self.currentSec = self.rewindHelper.time;
		self.rewindHelper.isActive = false;
		self.emit('rewind:apply');
	}


};


/**
 * Change current audio track.
 *
 * @return {boolean} state
 */
Player.prototype.nextAudioTrack = function () {
	var self = this;

	if ( this.audioPIDs.length <= 1 ) {
		return false;
	}

	if ( this.currentAudioPID < this.audioPIDs.length - 1 ) {
		this.currentAudioPID++;
	} else {
		this.currentAudioPID = 0;
	}
	gSTB.SetAudioPID(this.audioPIDs[this.currentAudioPID].pid);
	self.emit('audio:track', {
		lang: this.audioPIDs[this.currentAudioPID].lang[0],
		pid: this.audioPIDs[this.currentAudioPID].pid
	});
	return true;
};


/**
 * Set audio track to play by number.
 *
 * @param {number} number of audio track to play
 */
Player.prototype.setAudioTrack = function ( number ) {
	gSTB.SetAudioPID(this.audioPIDs[number].pid);
	this.currentAudioPID = number;
	this.emit('audio:track', {
		lang: this.audioPIDs[this.currentAudioPID].lang[0],
		pid: this.audioPIDs[this.currentAudioPID].pid
	});
};


/**
 * Change current aspect.
 */
Player.prototype.nextAspect = function () {
	this.activeAspect++;
	if ( this.activeAspect > this.aspects.length - 1 ) {
		this.activeAspect = 0;
	}

	gSTB.SetAspect(this.aspects[this.activeAspect].mode);
	this.emit('aspect:change', {
		type: this.aspects[this.activeAspect].mode,
		name: this.aspects[this.activeAspect].name
	});
};


/**
 * Set video aspect by number.
 *
 * @param {number} number of aspect to set
 */
Player.prototype.setAspect = function ( number ) {
	this.activeAspect = number;
	gSTB.SetAspect(this.aspects[this.activeAspect].mode);
	this.emit('aspect:change', {
		type: this.aspects[this.activeAspect].type,
		name: this.aspects[this.activeAspect].name
	});
};


/**
 * Show/hide subtitles or change current subtitle.
 *
 * @return {boolean} state
 */
Player.prototype.nextSubtitle = function () {

	if ( this.subtitlePIDs.length <= 0 ) {
		this.emit('subtitles:change', null);
		return false;
	}

	if ( this.currentSubtitle === null ) {
		this.currentSubtitle = 0;
	} else if ( this.currentSubtitle < this.subtitlePIDs.length - 1) {
		this.currentSubtitle++;
	} else {
		this.currentSubtitle = null;
	}

	if (this.currentSubtitle !== null) {
		gSTB.SetSubtitlePID(this.subtitlePIDs[this.currentSubtitle].pid);
		gSTB.SetSubtitles(true);
		this.emit('subtitles:change', {
			lang: this.subtitlePIDs[this.currentSubtitle].lang[0],
			pid: this.subtitlePIDs[this.currentSubtitle].pid
		});
	} else {
		gSTB.SetSubtitles(false);
		this.emit('subtitles:change', null);
	}

	return true;
};


/**
 * Set current subtitle number from subtitle list.
 *
 * @param {number} number of current set subtitle
 */
Player.prototype.setSubtitle = function ( number ) {

	if ( DEBUG ) {
		if ( !number || Number(number) !== number ) {
			throw 'wrong subtitle number type';
		}
	}

	gSTB.SetSubtitlePID(this.subtitlePIDs[number].pid);
	gSTB.SetSubtitles(true);
	this.currentSubtitle = number;
	this.emit('subtitles:change', {
		lang: this.subtitlePIDs[this.currentSubtitle].lang[0],
		pid: this.subtitlePIDs[this.currentSubtitle].pid
	});
};


/**
 * Wrapper of gSTB.gSTB.SetSubtitles(false).
 */
Player.prototype.hideSubtitles = function () {
	gSTB.SetSubtitles(false);
	this.emit('subtitles:change', null);
};


/**
 * Load text subtitles from external subtitle file of srt, sub, ass formats.
 *
 * @param {string} url of external subtitles address
 */
Player.prototype.loadExternalSubtitle = function ( url ) {
	if ( url && typeof url === 'string' ) {
		gSTB.LoadExternalSubtitles(url);
		this.subtitlePIDs.push({
			pid: 0x2000
		});
		this.emit('subtitles:load', null);
	}
};


/**
 * Change view mode.
 */
Player.prototype.nextViewMode = function () {
	var cur = gSTB.Get3DConversionMode();

	if ( cur < 3 ) {
		cur++;
	} else {
		cur = 0;
	}
	this.emit('viewmode:change', {
		type: this.stereoModes[cur].mode,
		name: this.stereoModes[cur].name
	});
	gSTB.Set3DConversionMode(cur);
};


/**
 * Set view mode.
 *
 * @param {number} number of view mode from 0 to 3
 */
Player.prototype.setViewMode = function ( number ) {
	if ( number > 0 && number <= 3 ) {
		gSTB.Set3DConversionMode(number);
		this.emit('viewmode:change', {
			type: this.stereoModes[number].mode,
			name: this.stereoModes[number].name
		});
	}
};


/**
 * Set position time.
 *
 * @param {number} code of pressed key
 */
Player.prototype.inputPosition = function ( code ) {
	var self = this,
		num = parseInt(code, 10) - 48,
		curr = [],
		setSec = 0,
		timeoutSec,
		h, m, s;

	if ( !this.allowInputPosition ) {
		return;
	}

	if ( !this.setModeHelper.active ) {
		if ( this.setModeHelper.length === 6 ) {
			this.setModeHelper.time = [0, 0, 0, 0, 0, 0];
		} else {
			this.setModeHelper.time = [0, 0, 0, 0];
		}
		this.setModeHelper.count = 0;
		this.setModeHelper.active = true;
		if ( this.setModeHelper.length === 6 ) {
			this.emit('position:input', {
				time: '00:00:00', start: true, sec: 0
			});
		} else {
			this.emit('position:input', {time: '00:00', start: true, sec: 0});
		}
	}

	if ( this.setModeHelper.count <= this.setModeHelper.length ) {
		this.setModeHelper.time.shift();
		this.setModeHelper.time.push(num);
		curr = this.setModeHelper.time.slice(0, this.setModeHelper.length + 1);
		if ( this.setModeHelper.length === 6 ) {
			this.setModeHelper.timeStr = curr[0].toString() + curr[1].toString() + ':' + curr[2].toString() + curr[3].toString() + ':' + curr[4].toString() + curr[5].toString();
		} else {
			this.setModeHelper.timeStr = curr[0].toString() + curr[1].toString() + ':' + curr[2].toString() + curr[3].toString();
		}
		this.setModeHelper.count++;
		//
		if ( this.setModeHelper.length === 6 ) {
			h = curr.shift() + curr.shift().toString();
			setSec += parseInt(h, 10) * 3600;
		}
		m = curr.shift() + curr.shift().toString();
		setSec += parseInt(m, 10) * 60;
		s = curr.shift() + curr.shift().toString();
		setSec += parseInt(s, 10);
		if ( setSec > this.totalDurationSec ) {
			setSec = this.totalDurationSec;
		}
		this.setModeHelper.sec = setSec;
		this.emit('position:input', {
			time: self.setModeHelper.timeStr,
			sec: setSec
		});
	}
	clearTimeout(this.setModeHelper.timeout);
	if ( this.setModeHelper.timeoutDuration ) {
		timeoutSec = this.setModeHelper.timeoutDuration;
	} else {
		timeoutSec = 2000;
	}
	this.setModeHelper.timeout = setTimeout(function () {
		self.setModeHelper.active = false;

		// stop listening current position
		clearInterval(self.durationInterval);
		self.durationInterval = 0;

		gSTB.SetPosTime(self.setModeHelper.sec);
		self.emit('position:input', {
			time: self.setModeHelper.timeStr,
			sec: self.setModeHelper.sec,
			end: true
		});
	}, timeoutSec);
};


/**
 * Set position of playing current content.
 *
 * @param {number} sec to set position
 */
Player.prototype.setPosition = function ( sec ) {
	if ( DEBUG ) {
		if ( sec < 0 ) {
			throw 'Time must be positive';
		}
	}

	gSTB.SetPosTime(sec);
	this.emit('position:set', {sec: sec});
};


/**
 * Convert seconds to time object contains hours, minutes and seconds.
 *
 * @param {number} sec to convert
 * @return{object} {{hour: *, min: *, sec: *}}
 */
Player.prototype.parseTime = function ( sec ) {
	var h, m, s;

	if ( sec >= 0 ) {
		h = Math.floor(sec / 3600);
		m = Math.floor((sec - h * 3600) / 60);
		s = sec - h * 3600 - m * 60;
		if ( h < 10 ) {
			h = '0' + h;
		}
		if ( s < 10 ) {
			s = '0' + s;
		}
		if ( m < 10 ) {
			m = '0' + m;
		}
	} else {
		sec = Math.abs(sec);
		h = Math.floor(sec / 3600);
		m = Math.floor((sec - h * 3600) / 60);
		s = sec - h * 3600 - m * 60;
		if ( h < 10 ) {
			h = '0' + h;
		}
		if ( s < 10 ) {
			s = '0' + s;
		}
		if ( m < 10 ) {
			m = '0' + m;
		}
		h = '-' + h;
	}
	return {hour: h, min: m, sec: s};
};


// public
module.exports = Player;
