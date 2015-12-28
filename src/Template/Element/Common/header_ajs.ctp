<header>
    <div class="navbar navbar-primary">
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

            <ul class="nav navbar-nav ">
                <li class="dropdown">
                    <a data-toggle="dropdown" ng-if="currentSport">{{currentSport.name}} <b class="caret"></b></a>
                    <a data-toggle="dropdown" ng-if="!currentSport">All sports <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a href="#/" ng-click="setCurrentSport(null)">All sports</a></li>
                        <li ng-repeat="sport in sports">
                            <a ng-href="#/sports/{{sport.name}}" ng-click="setCurrentSport(sport)">
                                {{sport.name}}
                            </a>
                        </li>
                    </ul>
                </li>
                <!--<li><a href="#/"><span class="glyphicon glyphicon-map-marker"></span> Best of</a></li>-->
                <li><a href="#/video/add"><span class="glyphicon glyphicon-plus-sign"></span> Create </a></li>
                <li ng-if="!isAuthed"><a href="#/users/login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
                <li ng-if="isAuthed" class="dropdown">
                    <a class="" data-toggle="dropdown" >
                        <span class="glyphicon glyphicon-cog"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li> <a href="#/users/profile"><span class="glyphicon glyphicon-user"></span> Profile</a></li>
                        <li> <a href="#/users/settings"><span class="glyphicon glyphicon-cog"></span> Settings</a></li>
                        <li ng-click="logout()"><a href="#/users/login"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
                    </ul>
                </li>
            </ul>
            <div class="col-sm-4 pull-left">
                <form class="navbar-form" role="search">
                    <div class="input-group">
                        <ui-select 
                            ng-model="search.tag" 
                            theme="bootstrap"
                            reset-search-input="false">
                            <ui-select-match placeholder="Trick name">
                                {{$select.selected.sport_name}},{{$select.selected.category_name}}: {{$select.selected.name}} 
                            </ui-select-match>
                            <ui-select-choices
                                repeat="tag in searchTags"
                                refresh="refreshSearchedTags($select.search)"
                                refresh-delay="500">
                                <div class="clearfix">
                                    <div class="col-xs-2">
                                        <span class="">{{tag.sport_name}}</span> <br/>
                                        <span class="">{{tag.category_name}}</span>
                                    </div>
                                    <div class="col-xs-8">
                                        <span class="">{{tag.name}}</span>
                                    </div>
                                    <div class="col-xs-2">
                                        <span>{{tag.count_ref}}</span>
                                    </div>
                                </div>
                            </ui-select-choices>
                        </ui-select>
                        <div class="input-group-btn">
                            <button class="btn btn-default" type="submit"><i class="glyphicon glyphicon-search"></i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</header>
