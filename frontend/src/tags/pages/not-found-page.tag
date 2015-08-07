<not-found-page>

    <div class="divide80"></div>
    <div class="container">
        <div class="row">
            <div class="col-md-12 text-center error-text">
                <div class="divide30"></div>
                <h1 class="error-digit wow animated fadeInUp margin20 animated" style="visibility: visible; animation-name: fadeInUp; -webkit-animation-name: fadeInUp;"><i class="fa fa-thumbs-down"></i></h1>
                <h2>{ data.message }</h2>
                <p><a href="#explore" class="btn btn-lg btn-theme-dark">Go Back</a></p>
            </div>
        </div>
    </div>
    <script>
        this.data = {
            message: 'Oops, that page could not be found!'
        }
            
        this.on('mount', () => {
            this.update()
        });
        
        
    </script>
</not-found-page>