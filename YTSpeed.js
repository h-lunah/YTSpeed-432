const ytSpeed = {
    basePlaybackRate: 1.0, // Base playback rate (user-defined)
    preservesPitch: false,
    wowAndFlutterInterval: null,
    wowFrequency: 0.5, // Frequency of wow (in Hz)
    flutterFrequency: 10, // Frequency of flutter (in Hz)
    jitterIntensity: 0.01, // Intensity of random jitter
    wowIntensity: 0.02, // Intensity of wow
    flutterIntensity: 0.01, // Intensity of flutter
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
            v.playbackRate = this.basePlaybackRate;
            v.preservesPitch = v.mozPreservesPitch = this.preservesPitch && this.basePlaybackRate !== 1.0;
        }
    },
    speedUp: function () {
        this.basePlaybackRate *= Math.pow(2, 1/12);
        ytSpeed.updateVideos();
    },
    speedDown: function () {
        this.basePlaybackRate /= Math.pow(2, 1/12);
        ytSpeed.updateVideos();
    },
    hz432: function () {
        this.basePlaybackRate *= Math.pow(2, -30/1200);
        ytSpeed.updateVideos();
    },
    hz440: function () {
        this.basePlaybackRate /= Math.pow(2, -30/1200);
        ytSpeed.updateVideos();
    },
    reset: function () {
        this.basePlaybackRate = 1.0;
        ytSpeed.updateVideos();
    },
    prompt: function () {
        const playbackRate = prompt("New playback speed:", this.basePlaybackRate);

        if (!playbackRate)
            return;
        else if (isNaN(parseFloat(playbackRate)))
            return;

        this.basePlaybackRate = parseFloat(playbackRate);
        ytSpeed.updateVideos();
    },
    startWowAndFlutter: function () {
        if (this.wowAndFlutterInterval) return; // Already running

        let startTime = Date.now();

        this.wowAndFlutterInterval = setInterval(() => {
            const now = Date.now();
            const time = (now - startTime) / 1000; // Convert to seconds

            // Wow: Low-frequency sine wave
            const wow = this.wowIntensity * Math.sin(2 * Math.PI * this.wowFrequency * time);

            // Flutter: High-frequency sine wave
            const flutter = this.flutterIntensity * Math.sin(2 * Math.PI * this.flutterFrequency * time);

            // Jitter: Random noise
            const jitter = this.jitterIntensity * (Math.random() - 0.5) * 2; // Random value between -jitterIntensity and +jitterIntensity

            // Apply effects on top of the base playback rate
            const effectivePlaybackRate = this.basePlaybackRate + wow + flutter + jitter;

            // Update videos with the effective playback rate
            const videos = document.getElementsByTagName('video');
            for (let i = 0; i < videos.length; ++i) {
                const v = videos[i];
                v.playbackRate = effectivePlaybackRate;
                v.preservesPitch = v.mozPreservesPitch = this.preservesPitch && effectivePlaybackRate !== 1.0;
            }
        }, 100); // Update every 100ms
    },
    stopWowAndFlutter: function () {
        if (this.wowAndFlutterInterval) {
            clearInterval(this.wowAndFlutterInterval);
            this.wowAndFlutterInterval = null;

            // Reset videos to the base playback rate
            const videos = document.getElementsByTagName('video');
            for (let i = 0; i < videos.length; ++i) {
                const v = videos[i];
                v.playbackRate = this.basePlaybackRate;
                v.preservesPitch = v.mozPreservesPitch = this.preservesPitch && this.basePlaybackRate !== 1.0;
            }
        }
    }
};

// Initialize ytSpeed
ytSpeed.init();