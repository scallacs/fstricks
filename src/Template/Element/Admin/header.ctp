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
                    <li class="dropdown text-capitalize">
                        <a data-toggle="dropdown" ng-if="currentSport"  class="text-big">
                            <b class="caret"></b> 
                            {{currentSport.name}}
                        </a>
                        <a data-toggle="dropdown" ng-if="!currentSport"  class="text-big">
                            <b class="caret"></b> 
                            All sports
                        </a>
                        <ul class="dropdown-menu">
                            <li><a ui-sref="videoplayer.best" ng-click="setCurrentSport(null)">All sports</a></li>
                            <li ng-repeat="sport in sports">
                                <a ui-sref="videoplayer.sport({sportName: sport.name})" 
                                   ng-click="setCurrentSport(sport)">
                                    <img ng-src="{{sport.name| imageUrl}}"> &nbsp;
                                    {{sport.name}}
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a ui-sref="test">
                            Validation
                        </a>
                    </li>
                    <li>
                        <a ui-sref="test">
                            Users
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


