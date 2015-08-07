<dynamic-page>
    <section id="{ _.kebabCase(data.title) }" >

        <div class="divide50"></div>

        <div class="container">

            <div id="modal_dialog_container">

            </div>
        </div>
    </section>
    <script type="es6">
        this.mixin('config'); 
        this.url = this.pathImg()
        this.height = window.innerHeight - 75;
        this.on('mount', () => {
            if(opts && opts.id && opts.id != '#') {
                
                FrontEnd.MetaFire.getData(`${FrontEnd.site}/explore/items/${opts.id}`).then( (data) => {
                    let dialogClass = 'blog-page'
                    
                    if(opts.id == 'the-systems-thinking-manifesto-poster') {
                        data = data || {}
                        dialogClass = 'manifesto-page'
                    } else if(opts.id == 'stms') {
                        data = data || {}
                        dialogClass = 'stms-page'
                    } else if (!data) {
                        data = data || {}
                        dialogClass = 'not-found-page'
                    }
                    
                    if(data) {
                        
                        this.update()
                    
                        opts.event = {
                            item: data,
                            id: opts.id,
                            dialog: this.modal
                        }
                        
                        riot.mount(this.modal_dialog_container, dialogClass, opts)
                        
                    }
                });
                
            }
        });
    </script>
</dynamic-page>