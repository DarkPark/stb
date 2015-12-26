/**
 * Remote access to the STB device.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
    gulp    = require('gulp'),
    log     = require('gulp-util').log,
    SSH2    = require('ssh2'),
    config  = require(path.join(global.paths.config, 'ssh')),
    appPort = require(path.join(global.paths.config, 'static')).port,
    appHost = require('ip').address(),
    title   = 'remote  '.inverse.yellow,
    stderr  = false,
    msgSet  = {
        1   : 'The player reached the end of the media content or detected a discontinuity of the stream.',
        2   : 'Information on audio and video tracks of the media content is received. It\'s now possible to call gSTB.GetAudioPIDs etc.',
        4   : 'Video and/or audio playback has begun.',
        5   : 'Error when opening the content: content not found on the server or connection with the server was rejected.',
        6   : 'Detected DualMono AC-3 sound.',
        7   : 'The decoder has received info about the content and started to play. It\'s now possible to call gSTB.GetVideoInfo.',
        8   : 'Error occurred while loading external subtitles.',
        9   : 'Found new teletext subtitles in stream.',
        32  : 'HDMI device has been connected.',
        33  : 'HDMI device has been disconnected.',
        34  : 'Recording task has been finished successfully. See Appendix 13. JavaScript API for PVR subsystem.',
        35  : 'Recording task has been finished with error. See Appendix 13. JavaScript API for PVR subsystem.',
        40  : 'Scanning DVB Channel in progress.',
        41  : 'Scanning DVB Channel found.',
        42  : 'DVB Channel EPG update.',
        43  : 'DVB antenna power off.',
        129 : 'When playing RTP-stream the numbering of RTP-packets was broken.'
    };


if ( config.active ) {
    // make sure the default profile is set
    config.defaults = config.defaults || {};

    // profiles seems ok
    if ( config.profiles && typeof config.profiles === 'object' ) {
        // rework profiles to extend defaults with each profile values
        Object.keys(config.profiles).forEach(function ( profileName ) {
            // reworked profile placeholder
            var profile = Object.create(config.defaults);

            // overwrite the necessary properties
            Object.keys(config.profiles[profileName]).forEach(function ( key ) {
                if ( key in config.profiles[profileName] ) {
                    profile[key] = config.profiles[profileName][key];
                }
            });

            // create associated task
            gulp.task('ssh:' + profileName, function ( done ) {
                // get connection instance
                var ssh = new SSH2();

                // prepare and execute
                ssh.on('ready', function () {
                    log(title, 'Connection is ready'.bold);

                    // substitute template vars
                    profile.exec = profile.exec.replace(/%host%/g, appHost);
                    profile.exec = profile.exec.replace(/%port%/g, appPort);

                    // run
                    ssh.exec(profile.exec, function ( err, stream ) {
                        if ( err ) {
                            throw err;
                        }

                        stream.on('exit', function ( code, signal ) {
                            log('remote  '.bgRed, 'Stream: exit ' + ('(code: ' + code + ', signal: ' + signal + ')').grey);
                        });
                        stream.on('close', function () {
                            log('remote  '.bgRed, 'Stream: close');
                            ssh.end();
                            done();
                        });
                        stream.on('data', function ( data ) {
                            data.toString().split('\n').forEach(function ( line ) {
                                var parts = line.split(' ');

                                if ( line ) {
                                    if ( line.indexOf('DEBUG::') !== -1 ) {
                                        // regular output
                                        log(title, line.replace('DEBUG:: ', ''));
                                    } else {
                                        // system/player output
                                        if ( parts[0] === 'Event' ) {
                                            log(title, line.bgBlue);
                                            if ( msgSet[parts[1]] ) {
                                                log(title, msgSet[parts[1]].grey);
                                            }
                                        } else if ( parts[0] === 'sol' ) {
                                            log(title, line.bgYellow);
                                        } else if ( parts[0] === 'URL' ) {
                                            log(title, line.yellow);
                                        } else {
                                            if ( line === 'STBPlayer Engine Created' || line === 'STBplayer - console-based player using STBengine' ) {
                                                log(title, line.green);
                                            } else {
                                                log(title, line);
                                            }
                                        }
                                    }
                                }
                            });
                        });

                        if ( stderr ) {
                            stream.stderr.on('data', function ( data ) {
                                data.toString().split('\n').forEach(function ( line ) {
                                    if ( line ) {
                                        log(title, line);
                                    }
                                });
                            });
                        }
                    });
                }).connect(profile);
            });
        });
    }
}
