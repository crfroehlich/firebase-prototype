<page-main id="main">

    <page-banner></page-banner>

    <div class="divide60"></div>

    <page-message></page-message>

    <div class="divide80"></div>

    <page-methodology></page-methodology>

    <div class="divide50"></div>

    <page-testimonials></page-testimonials>

    <div class="divide50"></div>

    <page-impact></page-impact>

    <div class="divide50"></div>

    <page-countmein></page-countmein>

    <div class="divide70"></div>

    <page-news></page-news>

    <div class="divide50"></div>

    <div id="explore_container">

    </div>

    <div class="divide40"></div>

    <script type="es6">
        var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        if(!isSafari) {
            this.on('mount', () => {
                window.setTimeout( () => {
                    riot.mount(this.explore_container, 'page-explore', { items: [] });
                }, 250);
            })
        }

    </script>
    
</page-main>