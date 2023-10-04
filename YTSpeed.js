var ytSpeed;

if (typeof ytSpeed === 'undefined')
{
    ytSpeed =
        {
            playbackRate: 1.0,
            preservesPitch: false,
            init: function ()
            {
                var observer = new MutationObserver(function (mutations)
                {
                    ytSpeed.updateVideos();
                });

                observer.observe(
                    document.querySelector('body'),
                    {
                        attributes: true,
                        childList: true,
                        characterData: true,
                        subtree: true
                    });

                ytSpeed.updateVideos();
            },
            updateVideos: function ()
            {
                var videos = document.getElementsByTagName('video');
                for (var i = 0; i < videos.length; ++i)
                {
                    var v = videos[i];
                    v.playbackRate = this.playbackRate;
                    v.preservesPitch = v.mozPreservesPitch = this.preservesPitch && this.playbackRate != 1.0;
                }
            },
            speedUp: function ()
            {
                this.playbackRate *= 1.05946309436;
                ytSpeed.updateVideos();
            },
            speedDown: function ()
            {
                this.playbackRate /= 1.05946309436;
                ytSpeed.updateVideos();
            },
            reset: function ()
            {
                this.playbackRate = 1.0;
                ytSpeed.updateVideos();
            },
            prompt: function ()
            {
                var playbackRate = prompt("New playback speed:", this.playbackRate);

                if (!playbackRate)
                    return;

                this.playbackRate = playbackRate;
                ytSpeed.updateVideos();
            }
        };
    ytSpeed.init();
}