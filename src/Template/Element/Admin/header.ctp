<header>
    <div class="navbar navbar-primary">
        <div class="bg-secondary clearfix">

            <div class="clearfix bg-secondary padding-sm-side">
                <div class="navbar-header">
                    <div class="header-title pull-left hidden-sm hidden-xs">
                        <a href="" ui-sref="home()">
                            <span class="hidden-sm hidden-xs">{{config.name}}</span>
                            <span class="hidden-lg hidden-md">{{config.short_name}}</span>
                        </a> 
                    </div>
                </div>
                <ul id="TopNav" class="nav navbar-nav navbar-no-collapse ">
                    <li>
                        <a ui-sref="home">
                            ADMINISTRATION
                        </a>
                    </li>
                    <li>
                        <a ui-sref="videotag.index">
                            Validation
                        </a>
                    </li>
                    <li>
                        <a ui-sref="users.index">
                            Users
                        </a>
                    </li>
                    <li>
                        <a ui-sref="logout">
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
            <div class="bg-secondary padding-sm-side" top-search current-search="SharedData.currentSearch">
            </div>

            <div class="col-sm-6 nopadding" ui-view="viewNavRight" ></div>
        </div>
    </div>
</header>


