<stms-page>
    <div class="row">
        <div class="col-sm-12 ">
            <div class="center-heading">
                <h2>{ data.header.title }</h2>
                <span class="center-line"></span>
                <p>
                    <raw content="{ data.header.text }"/>
                </p>
            </div>
            <div class="row">
                <div each="{ _.sortBy(data.items,'order') }" class="col-sm-6">
                    <div >
                        <iframe if="{ youtubeid }"
                            id="ytplayer_{ youtubeid }"
                            type="text/html"
                                height="400"
                            src="https://www.youtube.com/embed/{ youtubeid }?autoplay=0"
                            frameborder="0" allowfullscreen="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="es6">
        this.data = null
        this.on('mount', () => {
            FrontEnd.MetaFire.getData(`${FrontEnd.site}/stms`).then( (data) => {
                this.data = data
                this.update()
            });
        });
    </script>
</stms-page>