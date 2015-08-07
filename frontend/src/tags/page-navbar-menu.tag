<page-menu-navbar>
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
            <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }">
                <a if="{ val.title }" 
                   href="{ val.link || '#' }" 
                   target="{ _blank: val.link.startsWith('http') }"
                   >
                    <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i>
                </a>
                
            </li>
        </ul>
    </div>
    <script type="es6">
        this.data = []
        
        FrontEnd.MetaFire.getData(`${FrontEnd.site}/navbar`).then( (data) => {
            
            try {
                this.data = _.filter(_.sortBy(data, 'order'), (i) => { return i.archive != true });
                this.update();
            } catch(e) {
                window.FrontEnd.error(e);
            }
        })
    </script>
</page-menu-navbar>