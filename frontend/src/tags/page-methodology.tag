<page-methodology id="methodology">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="center-heading">
                    <h2>{ header.title }</h2>
                    <span class="center-line"></span>
                    <p class="lead">{ header.text }</p>
                </div>
            </div>
        </div>
        <div class="divide30"></div>
        <div class="row">
            <div class="col-md-6">
                <div class="center-heading">
                    <h4>{ frameworks.header.title }</h4>
                    <p class="lead">{ frameworks.header.text }</p>
                </div>
                <div class="panel-group" id="frameworks">
                    <div each="{ val, i in _.sortBy(frameworks.items, 'order') }" class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#frameworks" href="#collapseFrameworks_{ i }">
                                    { val.title }
                                </a>
                            </h4>
                        </div>
                        <div id="collapseFrameworks_{ i }" class="panel-collapse collapse { in: i == 0 }">
                            <div class="panel-body">
                                { val.text }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--collapse col-->
            <div class="col-md-6">
                <div class="center-heading">
                    <h4>{ partners.header.title }</h4>
                    <p class="lead">{ partners.header.text }</p>
                </div>
                <div class="panel-group" id="accordion">
                    <div each="{ val, i in _.sortBy(partners.items, 'order') }" class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne_{ i }">
                                    { val.title }
                                </a>
                            </h4>
                        </div>
                        <div id="collapseOne_{ i }" class="panel-collapse collapse { in: i == 0 }">
                            <div class="panel-body">
                                { val.text }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();

        FrontEnd.MetaFire.getData(FrontEnd.site + '/methodology').then( (data) => {
            try {
                this.header = data.header;
                this.frameworks = data.frameworks;
                this.partners = data.partners;
            
                this.update();
            } catch(e) {
                window.FrontEnd.error(e);
            }
        })

    </script>
</page-methodology>