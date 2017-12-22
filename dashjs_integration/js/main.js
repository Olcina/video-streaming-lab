// TODOL: Here we load the players and the elements

class VideoController {
    constructor(root_name = 'root',
                globalTime = 0,
                controlerMuted = true,
                controlerPlaying = false) {
        this.players = [];
        // this.player = dashjs.MediaPlayer().create()
        this.root_name = root_name;
        this.globalTime = globalTime;
        // this.init();
        this.controlerMuted = controlerMuted;
    }

    init() {
        // create and append the video elements on the root element
        //  - 4 video tags
        const n = 4;
        for (let i = 0; i < n; i++) {
        //     let base_element = document.createElement(`video`);
        //     base_element.setAttribute('id', `video${i}`);
        //     base_element.setAttribute('controls', '');
        //     document.getElementById(this.root_name).appendChild(base_element);

            this.players.push(dashjs.MediaPlayer().create())
        }
        // // bar wrapper
        // let barWrapper = document.createElement('div')
        // barWrapper.setAttribute('id', 'barWrapper')
        // let bar = document.getElementById(this.root_name).appendChild(barWrapper)

        // // play button
        // let play_button  = document.createElement('div')
        // play_button.setAttribute('id', 'playButton')
        // let playbtn = document.getElementById('barWrapper').appendChild(play_button);
        // playbtn.className = 'btn';
        // playbtn.innerText = 'Play';

        // let time_span = document.createElement('div')
        // time_span.setAttribute('id', 'timeSpan')
        // let timeSpan = document.getElementById('barWrapper').appendChild(time_span);
        // timeSpan.className = 'btn'
        // timeSpan.innerText = '0';
        // //  pause button 
        
        // let mute_button = document.createElement('div')
        // mute_button.setAttribute('id', 'muteButton')
        // let mutebtn = document.getElementById('barWrapper').appendChild(mute_button);
        // mutebtn.className = 'btn';
        // mutebtn.innerText = 'Mute';
        // let html_to_root = `<video id='video1'></video>
        //                     <video id='video2'></video>
        //                     <video id='video3'></video>
        //                     <video id='video4'></video>
        //                     <div id='playButton' class='btn'></div>`

        // document.getElementById(this.root_name).innerHTML= html_to_root;
    }


    add(slot, url) {
        let html_vid_element = document.querySelector(`#video${slot}`)
        this.players[slot].initialize(html_vid_element,url, false)
        return new Promise((resolve,reject) => {
            if (this.players[slot].isReady()) {
                resolve(console.log(`ready vid${slot}`));
            }
     })
    }
    pause() {
        for (const player of this.players) {
            try {
                player.pause();
            } catch (e) {}
        };
    }
    tooglePlay() {
        // set state of the players to the controlerPlaying state
        for (const player of this.players) {
            if (!this.controlerPlaying) {
                try {
                    player.play();
                } catch (e) {}
            } else {

                try {
                    player.pause();
                } catch (e) {}
            }
        };
        // change global playing status
        this.controlerPlaying = !this.controlerPlaying;
    }
    seek(value) {

        for (const player of this.players) {
            try {
                player.seek(value);
            } catch (e) {}
        };
    }
    toogleGlobalMute() {
        // set the state of all video players to false
        for (const player of this.players) {
            try {
                player.setMute(this.controlerMuted);
            } catch (e) { }
        };
        // change the global muted state
        this.controlerMuted = !this.controlerMuted;
    }
    forward10(){
        this.globalTime +=10;
        for (const player of this.players) {
            try {
                player.seek(this.globalTime);
            } catch (e) { }
        };
    }
    backward10() {
        if (this.globalTime <=10) {
            this.globalTime = 0;
        } else {
            this.globalTime -= 10;
        }
        for (const player of this.players) {
            try {
                player.seek(this.globalTime);
            } catch (e) { }
        };
    }
};

const controler = new VideoController;
let url = "videos/manifest.mpd";

console.log(controler.players)

// call load videos when document == ready
ready().then(loadVideos);
// create the ready promise
function ready() {
    return new Promise(function (resolve) {
        if (document.readyState === "complete") {
            resolve();
        } else {
            document.addEventListener("DOMContentLoaded", resolve);
        }
    });
}

function loadVideos() {
    console.log(controler)
    console.log(url)
    console.log(document.querySelector(`#video1`))
    controler.init();
    controler.add(0, url)
    controler.add(1, url)
    controler.add(2, url)
    controler.add(3, url)
    console.log(controler.players)
}


window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case '0':
            controler.add(0, url)
            break;
        case '1':
            controler.add(1, url)
            break;
        case '2':
            controler.add(2, url)
            break;
        case '3':
            controler.add(3, url)
            break;
        case 'm':
            controler.toogleGlobalMute();
            break;
        case "ArrowLeft":
            // Do something for "left arrow" key press.

            controler.backward10();
            break;
        case "ArrowRight":
            // Do something for "right arrow" key press.
            controler.forward10()
            break;
        case " ":
            // Do something for "espace" key press.
            controler.tooglePlay();
            break;
        default:
            console.log(event.key)
            return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);


// Make a Promise before calling the function document ready


function watchers() {
    document.getElementById('timeSpan').innerText = `${controler.players[0].time()}/${controler.players[0].duration()}`
    controler.globalTime = controler.players[0].time();
    document.getElementById('playButton').addEventListener('click', function(e){
        console.log('played')
        controler.tooglePlay();
        e.stopImmediatePropagation();
        
    }, false) 
    document.getElementById('muteButton').addEventListener('click', function (e) {
        console.log('played')
        controler.toogleGlobalMute();
        e.stopImmediatePropagation();

    }, false) 
}

document.getElementById('add1').addEventListener('click', function (e) {
    controler.add(0,url);   
},false)
document.getElementById('add2').addEventListener('click', function (e) {
    controler.add(1, url);
}, false)
document.getElementById('add3').addEventListener('click', function (e) {
    controler.add(2, url);
}, false)
document.getElementById('add4').addEventListener('click', function (e) {
    controler.add(3, url);
}, false)

window.setInterval(function() {
        watchers();}
    ,1000);


document.getElementById('prog').addEventListener('click', function(e) {
    console.log(e.pageX)
    let x = e.pageX
    let ele = document.getElementById('prog');
    let ele2 = document.getElementById('prog2');
    let ele_x = ele.getBoundingClientRect()['left'];
    let ele_width = ele.getBoundingClientRect()['width'];
    console.log(x, ele_x,ele_width)
    let percentage =(x-ele_x)/ele_width
    console.log(ele2.style[0].width)
    ele2.style = `width:${percentage*100}%`

    let time = controler.players[0].duration()*percentage;
    console.log(time)

    controler.globalTime = time;
    controler.seek(time);
    e.stopImmediatePropagation();
})

