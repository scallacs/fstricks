<header>
    <div class="navbar navbar-default">
        <div class="navbar-header">
            <div class="header-title pull-left">
                <span>Tricker</span>
            </div>
            <!-- Collection of nav links and other content for toggling -->
            <ul class="pull-right list-unstyled list-inline">
                <li>
                    <button type="button" 
                            data-target="#navbarCollapse" 
                            data-toggle="collapse" 
                            class="navbar-toggle">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </li>
            </ul>
        </div>
        <div class="collapse navbar-collapse" role="navigation" id="navbarCollapse">
            <ul class="nav navbar-nav navbar-right">
                <!--<li><input type="text" class="form-control" placeholder="Search tricks"/></li>-->
                <li><a href="#/"><span class="glyphicon glyphicon-map-marker"></span> Best of</a></li>
                <li><a href="#/video/add"><span class="glyphicon glyphicon-plus-sign"></span> Create </a></li>
                <li ng-if="!isAuthed"><a href="#/users/login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
                <li ng-if="isAuthed"><a href="#/users/profile"><span class="glyphicon glyphicon-user"></span> Profile</a></li>
                <li ng-if="isAuthed" ng-click="logout()"><a href="#/users/login"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
            </ul>
        </div>
    </div>
</header>
