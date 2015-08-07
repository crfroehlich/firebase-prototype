<blog-page>
    <div if="opts" class="row">
        <div class="col-sm-12 ">
            <div class="center-heading">
                <h2>{ data.title }</h2>
                <span class="center-line"></span>
                <p>
                    <raw content="{ data.text }"/>
                </p>
            </div>
            <iframe if="{ data.youtubeid }"
                    id="ytplayer"
                    type="text/html"
                    width="720"
                    height="405"
                    src="https://www.youtube.com/embed/{ data.youtubeid }?autoplay=1"
                    frameborder="0" allowfullscreen=""
                    class="fitvids"
                    style="height: 405px; width: 720px; display: block; margin-left: auto; margin-right: auto;"
                />
            <iframe if="{ data.vimeoid }" src="https://player.vimeo.com/video/{ data.vimeoid }"
                    width="720"
                    height="405"
                    frameborder="0"
                    webkitallowfullscreen=""
                    mozallowfullscreen=""
                    allowfullscreen=""
                    class="fitvids"
                    style="height: 405px; width: 720px; display: block; margin-left: auto; margin-right: auto;" />
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
                
                let ref = FrontEnd.MetaFire.getChild(`${FrontEnd.site}/content/${opts.event.id}`)
                let firepad = new Firepad.Headless(ref);
                firepad.getHtml( (html) => {
                    this.blog = html;
                    this.update();
                });
            }
        });
        
    </script>
</blog-page>