<page-countmein id="countmein">
    <section if="{ data }" style="background: rgb(212, 214, 215);">

        <div class="divide50"></div>

        <div class="container">
            <div class="row">
                <div id="impact_img"  class="col-md-6">
                    <img class="img-responsive" alt="7 billion thinkers" src="{ url+impact.img}?tag=countmein"></img>
                </div>
                <div class="col-md-6">
                    <br/>
                    <div class="facts-in">
                        <h3>
                            <span id="counter" class="counter">{ Humanize.formatNumber(data.total) }</span>+
                        </h3>
                        <br/>
                        <h3 style="font-size: 35px; font-weight: 700;">{ engage.subtext }</h3>
                        <div id="mc_embed_signup">
                            <form action="//cabreralabs.us4.list-manage.com/subscribe/post?u=58947385383d323caf9047f39&amp;id=9799d3a7b9" 
                                  method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="" target="_blank" novalidate="">
                            <p style="color: #fff;">{ data.newsletter.text }</p>
                                <div id="mc_embed_signup_scroll">
                                    <div class="mc-field-group">
                                        <div class="input-group">
                                            
                                            <input type="email" 
                                                   placeholder="Email..."
                                                   style="height: 31px;"
                                                   value="" name="EMAIL" class="form-control" id="mce-EMAIL" />
                                            <span class="input-group-btn">
                                                <input role="button" type="submit" style="font-variant: small-caps; text-transform: none;" value="{ impact.text }" name="subscribe"
                                                    id="mc-embedded-subscribe"
                                                    class="btn btn-theme-bg">{ impact.text }</input>
                                            </span>
                                        </div>
                                        
                                    </div>
                                    <!--real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                                    <div style="position: absolute; left: -5000px;">
                                        <input type="text" name="b_58947385383d323caf9047f39_9799d3a7b9" tabindex="-1" value="" />
                                    </div>
            
                                    <div id="mce-responses" class="clear" style="margin-top: 5px;">
                                        <div class="response" id="mce-error-response" style="color: red; display:none"></div>
                                        <div class="response" id="mce-success-response" style="color: #fff; display:none"></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="row">
                            <div class="col-md-4 col-sm-4 col-xs-4">
                                
                            </div>
                            <div class="col-md-6 col-sm-4 col-xs-4">
                                <div class="addthis_horizontal_follow_toolbox"></div>
                            </div>
                            <div class="col-md-3 margin30 hidden-xs hidden-sm">

                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="row">
                    <div class="col-md-12">
                        
                        <div class="row">
                            <div class="col-md-12">
                                <div class="no-padding-inner gray">
                                    <h3 class="wow animated fadeInDownfadeInRight animated" style="visibility: visible; text-align: center;">
                                       { numberToWords(engage.options.length) } more things you can do:
                                    </h3>
                                    <div class="row">
                                        <div class="col-md-4" each="{ val, i in engage.options }">
                                            <div class="services-box margin30 wow animated fadeInRight animated" style="visibility: visible; animation-name: fadeInRight; -webkit-animation-name: fadeInRight;">
                                                <div class="services-box-icon">
                                                    <i class="{ val.icon }"></i>
                                                </div>
                                                <div class="services-box-info">
                                                    <h4>{ val.title }</h4>
                                                    <p>{ val.text }</p>
                                                    <div if="{ val.buttons }" each="{ _.sortBy(val.buttons, 'order') }">
                                                        <a href="{ link || '' }"
                                                            target="{ target || ''}"
                                                            class="btn btn-lg btn-theme-dark">{ title }</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <script>
        this.data = null
        this.mixin('config'); 
        this.url = this.pathImg('site');
        
        FrontEnd.MetaFire.getData(`${FrontEnd.site}/count-me-in`).then( (data) => {
            try {
                this.data = data;
                this.impact = data.impact;
                this.engage = data.engage;
                this.engage.options = _.filter(_.sortBy(data.engage.options, 'order'), (opt) => {return opt.archive != true});
                this.header = data.header;
            
                this.update()
            
                $(this.counter).counterUp({
                    delay: 100,
                    time: 800
                });
            } catch(e) {
                window.FrontEnd.error(e);
            }
        });

    </script>
</page-countmein>