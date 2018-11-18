
var initialized;
var player;
var playing;

window.addEventListener('click', function () {
    if (window.initialized) {
        toggle();
        return;
    }
    initialized = true;
    SC.initialize({
        client_id: 'b95f61a90da961736c03f659c03cb0cc'
    });
    SC.resolve('https://soundcloud.com/kukangherita/tribal-muntaner').then(function (track) {
        SC.stream('/tracks/' + track.id).then(function (p) {
            player = p;
            toggle();
        });
    });

});

function toggle() {
    if (!player)
        return;

    playing = !playing;

    if (playing) {
        player.play();
    } else {
        player.pause();
    }
}