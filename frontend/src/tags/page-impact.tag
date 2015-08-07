<page-impact id="impact">
    <section>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="center-heading">
                        <h2 if="{ header }">{ header.title }</h2>
                        <span class="center-line"></span>
                        <p if="{ header }" class="lead">
                            { header.text }
                        </p>
                    </div>
                </div>
            </div>

            <div id="impact_slider" class="owl-carousel">
                <div class="item" each="{ items }">
                    <a href="javascript:;">
                        <img if="{ img }" width="200px" height="125px" src="{ parent.url }impact/{ img }?tag=impact&title={title}" alt="{ title }"/>
                    </a>
                </div>
            </div>
        </div>
    </section>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();

        FrontEnd.MetaFire.getData(FrontEnd.site + '/impact').then( (data) => {
            try {
                this.header = data.header;
                this.items = _.filter(_.sortBy(data.items, 'order'), (i) => { return i.archive != true });
                this.update();

                $(this.impact_slider).owlCarousel({
                    autoPlay: 5000,
                    pagination: false,
                    items: 4,
                    loop: true,
                    itemsDesktop: [1199, 4],
                    itemsDesktopSmall: [991, 2]
                    });
            } catch(e) {
                window.FrontEnd.error(e);
            }
        })
        
    </script>
</page-impact>