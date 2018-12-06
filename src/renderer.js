'use strict';
const { desktopCapturer } = require('electron')

desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error) throw error
    for (let i = 0; i < sources.length; ++i) {
        appList.value += sources[i].name + "\n";
    }
});

document.querySelector('#shareScreen').addEventListener('click', e => shareScreen(e));
document.querySelector('#shareApp').addEventListener('click', e => shareApp(e));

function shareApp(e) {
    try {
        var appName = document.getElementById('appName').value;
        var appList = document.getElementById('appList');
        desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
            if (error) throw error
            for (let i = 0; i < sources.length; ++i) {
                appList.value += sources[i].name + "\n";
                if (sources[i].name.toLowerCase().includes(appName.toLowerCase())) {
                    alert("You Selected : " + appName);
                    navigator.mediaDevices.getUserMedia(

                        {
                            audio: false,
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop',
                                    chromeMediaSourceId: sources[i].id,
                                }
                            }
                        }
                    )
                        .then((stream) => handleSuccess(stream))
                        .catch((e) => handleError(e));

                }
            }
        });

        e.target.disabled = true;
    } catch (e) {
        handleError(e);
    }
}

function shareScreen(e) {
    try {
        navigator.mediaDevices.getUserMedia(
            {
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                }
            }

        )
            .then((stream) => handleSuccess(stream))
            .catch((e) => handleError(e));


        e.target.disabled = true;
    } catch (e) {
        handleError(e);
    }
}


function handleSuccess(stream) {
    const video = document.querySelector('video');
    const videoTracks = stream.getVideoTracks();
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream;
    video.srcObject = stream;
}

function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        let v = constraints.video;
        errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}