<page-navbar>
    <div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <div>
                    <a href="#home"><img if="{ data }" 
                         style="margin-top: 7px; margin-right: 15px;"
                         src="{ url }site/{ data.img }?tag=navbar" 
                         alt="{ data.alt }" />
                    </a>
                </div>
            </div>
            <page-menu-navbar></page-menu-navbar>
        </div>
    </div>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();
        
        FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then( (data) => {
            
            try {                
                this.data = data;
                this.update();
                $(".sticky").sticky({ topSpacing: 0 });
            } catch(e) {
                window.FrontEnd.error(e);
            }
        })
        
        $(window).resize(function () {
            $(".navbar-collapse").css({ maxHeight: $(window).height() - $(".navbar-header").height() + "px" });
        });
    </script>
</page-navbar>