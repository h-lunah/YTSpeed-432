const ytSpeed = {
    playbackRate: 1.0,
    preservesPitch: false,
    wowFlutterEnabled: false,
    wowFlutterInterval: null,

    // Wow and flutter settings
    wowFrequency: 0.5,
    flutterFrequency: 10,
    wowAmount: 0.005,
    flutterAmount: 0.001,
    wowPhase: 0,
    flutterPhase: 0,

    init: function () {
        if (typeof ytSpeed !== "undefined") {
            console.log("ytSpeed already defined!")
            return;
        }
        
        let playerContainer = document.getElementById('movie_player');

        let observerOptions;
        if (!playerContainer) {
            playerContainer = document.querySelector('body');
            observerOptions = { childList: true, subtree: true };
        } else {
            observerOptions = { childList: true, subtree: true };
        }

        const observer = new MutationObserver(function () {
            ytSpeed.updateVideos();
        });

        observer.observe(playerContainer, observerOptions);

        ytSpeed.updateVideos();
        ytSpeed.setupWowFlutter();
    },

    setupWowFlutter: function () {
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'W') {
                ytSpeed.toggleWowFlutter();
            }
        });
    },

    toggleWowFlutter: function () {
        this.wowFlutterEnabled = !this.wowFlutterEnabled;

        if (this.wowFlutterEnabled) {
            this.startWowFlutter();
            console.log("Wow & Flutter effect enabled");
        } else {
            this.stopWowFlutter();
            console.log("Wow & Flutter effect disabled");
        }

        this.updateVideos();
    },

    startWowFlutter: function () {
        if (this.wowFlutterInterval) {
            clearInterval(this.wowFlutterInterval);
        }

        let startTime = Date.now();
        this.wowPhase = 0;
        this.flutterPhase = 0;

        this.wowFlutterInterval = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = (currentTime - startTime) / 1000;
            startTime = currentTime;

            this.wowPhase += this.wowFrequency * deltaTime * 2 * Math.PI;
            this.flutterPhase += this.flutterFrequency * deltaTime * 2 * Math.PI;

            this.wowPhase %= (2 * Math.PI);
            this.flutterPhase %= (2 * Math.PI);

            this.applyWowFlutter();

        }, 10);
    },

    stopWowFlutter: function () {
        if (this.wowFlutterInterval) {
            clearInterval(this.wowFlutterInterval);
            this.wowFlutterInterval = null;
        }

        const videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; ++i) {
            const v = videos[i];
            v.playbackRate = this.playbackRate;
        }
    },

    applyWowFlutter: function () {
        if (!this.wowFlutterEnabled) return;

        const videos = document.getElementsByTagName('video');
        if (videos.length === 0) return;

        const wowVariation = Math.sin(this.wowPhase) * this.wowAmount;

        let flutterVariation = Math.sin(this.flutterPhase) * this.flutterAmount;
        flutterVariation += (Math.random() - 0.5) * this.flutterAmount * 0.5;

        const totalVariation = wowVariation + flutterVariation;
        const effectiveRate = this.playbackRate * (1 + totalVariation);

        for (let i = 0; i < videos.length; ++i) {
            const v = videos[i];
            v.playbackRate = effectiveRate;
            v.preservesPitch = v.mozPreservesPitch =
                this.preservesPitch && this.playbackRate !== 1.0;
        }
    },

    updateVideos: function () {
        const videos = document.getElementsByTagName('video');

        for (let i = 0; i < videos.length; ++i) {
            const v = videos[i];
            if (!this.wowFlutterEnabled) {
                v.playbackRate = this.playbackRate;
            }
            v.preservesPitch = v.mozPreservesPitch =
                this.preservesPitch && this.playbackRate !== 1.0;
        }

        if (this.wowFlutterEnabled) {
            this.applyWowFlutter();
        }
    },

    speedUp: function () {
        this.playbackRate *= Math.pow(2, 1 / 12);
        ytSpeed.updateVideos();
    },

    speedDown: function () {
        this.playbackRate /= Math.pow(2, 1 / 12);
        ytSpeed.updateVideos();
    },

    hz432: function () {
        this.playbackRate *= Math.pow(2, -30 / 1200);
        ytSpeed.updateVideos();
    },

    hz440: function () {
        this.playbackRate /= Math.pow(2, -30 / 1200);
        ytSpeed.updateVideos();
    },

    reset: function () {
        this.playbackRate = 1.0;
        ytSpeed.updateVideos();
    },

    prompt: function () {
        const playbackRate = prompt("New playback speed:", this.playbackRate);

        if (!playbackRate) return;
        if (isNaN(parseFloat(playbackRate))) return;

        this.playbackRate = parseFloat(playbackRate);
        ytSpeed.updateVideos();
    },

    setWowFlutterIntensity: function (wowAmount, flutterAmount) {
        this.wowAmount = wowAmount || 0.005;
        this.flutterAmount = flutterAmount || 0.001;

        if (this.wowFlutterEnabled) {
            this.applyWowFlutter();
        }
    }
};

ytSpeed.init();
