const ytSpeed = {
    playbackRate: 1.0,
    preservesPitch: false,
    init: function () {
        const observer = new MutationObserver(function (mutations) {
            ytSpeed.updateVideos();
        });

        observer.observe(
            document.querySelector('body'),
            {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            }
        );

        ytSpeed.updateVideos();
    },
    updateVideos: function () {
        const videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; ++i) {
            const v = videos[i];
            v.playbackRate = this.playbackRate;
            v.preservesPitch = v.mozPreservesPitch = this.preservesPitch && this.playbackRate !== 1.0;
        }
    },
    speedUp: function () {
        this.playbackRate *= Math.pow(2, 1/12);
        ytSpeed.updateVideos();
    },
    speedDown: function () {
        this.playbackRate /= Math.pow(2, 1/12);
        ytSpeed.updateVideos();
    },
    hz432: function () {
        this.playbackRate *= Math.pow(2, -30/1200);
        ytSpeed.updateVideos();
    },
    hz440: function () {
        this.playbackRate /= Math.pow(2, -30/1200);
        ytSpeed.updateVideos();
    },
    reset: function () {
        this.playbackRate = 1.0;
        ytSpeed.updateVideos();
    },
    prompt: function () {
        const playbackRate = prompt("New playback speed:", this.playbackRate);

        if (!playbackRate)
            return;
        else if (isNaN(parseFloat(playbackRate)))
            return;

        this.playbackRate = parseFloat(playbackRate);
        ytSpeed.updateVideos();
    }
};

if (typeof ytSpeed === 'undefined') {
    ytSpeed.init();
}
