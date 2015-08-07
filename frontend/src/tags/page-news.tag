<page-news id="news">
    <div class="container">

        <div class="row">
            <div class="col-md-12">
                <h3 class="heading">Latest News</h3>
                <div id="news_carousel" class="owl-carousel owl-spaced">
                    <div each="{ data }">
                        <div class="news-desc">
                            <p>
                                <a href="{ link }" target="_blank">{ Humanize.truncate(title, 125) }</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="es6">
        this.data = [];

        FrontEnd.MetaFire.getData(`${FrontEnd.site}/news`).then( (data) => {
            try {
                this.data = _.filter(_.sortBy(data, 'order'), (i) => { return i.archive != true });
                this.update();
                $(this.news_carousel).owlCarousel({
                    // Most important owl features
                    items: 4,
                    itemsCustom: false,
                    itemsDesktop: [1199, 4],
                    itemsDesktopSmall: [980, 2],
                    itemsTablet: [768, 2],
                    itemsTabletSmall: false,
                    itemsMobile: [479, 1],
                    singleItem: false,
                    startDragging: true,
                    autoPlay: 5000,
                    loop: true
                });
            } catch(e) {
                window.FrontEnd.error(e);
            }
        })
    </script>
    
</page-news>