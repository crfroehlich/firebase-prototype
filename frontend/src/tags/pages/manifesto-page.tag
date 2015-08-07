<manifesto-page>
    <div class="row">
        <div class="col-sm-12 ">
            <div class="center-heading">
                <h2>{ data.title }</h2>
                <span class="center-line"></span>
                <p>
                    <raw content="{ data.text }"/>
                </p>
                <img src="https://c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/crlab/site/manifesto_poster_no_diagram.png" alt="Systems Thinking Manifesto" class="img-responsive"></img>
            </div>
            <div if="{ blog }" class="row">
                <div class="col-sm-12 ">
                    <div >
                        <raw content="{ blog }"/>
                    </div>
                    <buttons buttons="{ data.buttons }"></buttons>
                </div>
            </div>
            <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons>
        </div>
    </div>
    <script type="es6">
        this.on('mount', () => {
            if(opts && opts.event.id) {
                this.data = opts.event.item
                
                this.url = window.location.href
                
                this.update()
                
                let ref = FrontEnd.MetaFire.getChild(`${FrontEnd.site}/content/systems-thinking-manifesto`)
                let firepad = new Firepad.Headless(ref);
                firepad.getHtml( (html) => {
                    this.blog = html;
                    this.update();
                });
            }
        });
    </script>
</manifesto-page>