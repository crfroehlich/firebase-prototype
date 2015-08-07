<page-footer >
    <footer id="footer">
        <div id="contact" class="container">
            <div class="row">
                <div class="col-md-4 col-sm-6 margin30">
                    <div class="footer-col">
                        <h3>{ data.about.title }</h3>
                        <p style="color: #fff;">{ data.about.text }</p>
                        
                        <ul class="list-unstyled contact">
                            <li each="{ _.sortBy(data.contact,'order') }">
                                <p style="color: #fff;">
                                    <strong>
                                        <i class="{ icon }"></i>{ title || '' }
                                    </strong>
                                    <a if="{ link }" href="{ link }" style="color: #fff" >{ text || link }</a>
                                    <span if="{ !link }">{ text }</span>
                                </p>
                            </li>
                        </ul>
                        
                        <ul id="social_follow" class="list-inline social-1">
                            <li each="{ _.sortBy(data.about.social, 'order') }">
                                <a href="{ link }" alt="{ title }">
                                    <i class="{ icon }"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--footer col-->
                <div class="col-md-4 col-sm-6 margin30 hidden-xs hidden-sm">
                    <div class="footer-col">
                        <h3>Follow Us</h3>

                        <a if="{ social.twitter }" class="twitter-timeline" 
                           href="https://twitter.com/{ social.twitter.title }" 
                           data-widget-id="{ social.twitter.api }">Tweets by @{ social.twitter.title }</a>
                        
                    </div>
                </div>
                <!--footer col-->
                <div class="col-md-4 col-sm-6 margin30 hidden-xs hidden-sm" style="padding-right: 1px;">
                    <div class="footer-col">
                        <h3>Like Us</h3>
                        <div if="{ social.facebook }" class="fb-page" data-href="https://www.facebook.com/{ social.facebook.title }" 
                             data-small-header="true" 
                             data-adapt-container-width="true" 
                             data-hide-cover="false" 
                             data-show-facepile="true" 
                             data-height="300"
                             data-show-posts="true">
                            <div class="fb-xfbml-parse-ignore">
                                <blockquote cite="https://www.facebook.com/{ social.facebook.title }">
                                    <a href="https://www.facebook.com/{ social.facebook.title }">{ title }</a>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div if="{ data.copyright }" class="row">
                <div class="col-md-12 text-center">
                    <div class="footer-btm">
                        <span>
                            <raw content="{ data.copyright.text }"></raw>
                        </span>
                        <img style="display: block; margin-left: auto; margin-right: auto; height: 5%; width: 5%;" src="{ url+data.copyright.img+'?copy1' }"></img>
                        <span style="font-size: 8px;">{ data.copyright.license }</span>
                        <img style="display: block; margin-left: auto; margin-right: auto; height: 3%; width: 3%;" src="{ url+data.copyright.img2+'?copy2' }"></img>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg('site');
        
        this.social = null
        this.data = null
        this.title = FrontEnd.config.site.title
        
        FrontEnd.MetaFire.getData(`${FrontEnd.site}/footer`).then( (data) => {
            try {
                this.data = data;
                this.update();
            
                FrontEnd.MetaFire.getData(`${FrontEnd.site}/social`).then( (social) => {
                    this.social = social
                    this.update();
                    FrontEnd.initSocial()
                });
            } catch(e) {
                window.FrontEnd.error(e);
            }
        })
    </script>
</page-footer>