<buttons>
    <div class="row center-heading">
        <span each="{ _.sortBy(opts.buttons,'order') }">
            <a if="{ !amazonid }"
                role="button"
                href="{ link }"
                target="_blank"
                class="btn btn-lg btn-theme-dark"
                style="margin-right: 10px;">
                { title }
            </a>
            <div if="{ amazonid }" class="col-sm-{ parent.cell } ">
                <iframe
                        style="width: 120px; height: 240px;"
                        marginwidth="0"
                        marginheight="0"
                        scrolling="no"
                        frameborder="0"
                        src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=cabrreselab-20&marketplace=amazon&region=US&placement={ amazonid }&asins={ amazonid }&linkId=DIY3TUOPDFH3NQWF&show_border=false&link_opens_in_new_window=true"></iframe>
            </div>
        </span>
    </div>
    <script>
        this.cell = 6
        this.on('mount', () => {
            if(opts && opts.buttons) {
                this.cell = Math.round(12/_.keys(opts.buttons).length)
                this.update()
            }
        });
    </script>
</buttons>