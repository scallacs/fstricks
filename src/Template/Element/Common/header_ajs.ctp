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
                <li>
                <ui-select 
                    ng-model="videoTag.tag" 
                    theme="bootstrap"
                    reset-search-input="false">
                    <ui-select-match placeholder="Trick name">
                        {{$select.selected.name}} 
                    </ui-select-match>
                    <ui-select-choices
                        repeat="tag in suggestedTags"
                        refresh="refreshSuggestedTags($select.search)"
                        refresh-delay="500">
                        <div class="clearfix" ng-if="!tag.is_new">
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

                        <div class="clearfix"  ng-if="tag.is_new">
                            <div class="col-xs-2">
                                <span class="">{{tag.sport_name}}</span> <br/>
                                <span class="">{{tag.category_name}}</span>
                            </div>
                            <div class="col-xs-8">
                                <span class="">{{tag.name}}</span>
                            </div>
                            <div class="col-xs-2">
                                <span>(New!)</span>
                            </div>
                        </div>
                    </ui-select-choices>
                </ui-select>
                </li>
                <li><a href="#/"><span class="glyphicon glyphicon-map-marker"></span> Best of</a></li>
                <li><a href="#/video/add"><span class="glyphicon glyphicon-plus-sign"></span> Create </a></li>
                <li ng-if="!isAuthed"><a href="#/users/login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
                <li ng-if="isAuthed"><a href="#/users/profile"><span class="glyphicon glyphicon-user"></span> Profile</a></li>
                <li ng-if="isAuthed" ng-click="logout()"><a href="#/users/login"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
            </ul>
        </div>
    </div>
</header>
