<header>
    <div class="navbar navbar-primary">
        <div class="">

            <div class="bg-secondary clearfix">
                <div class="col-sm-6 nopadding">
                    <div class="clearfix bg-secondary  padding-sm-side">
                        <div class="navbar-header">
                            <div class="header-title pull-left  hidden-sm hidden-xs">
                                <span><?= \Cake\Core\Configure::read('Company.name') ?></span>
                            </div>
                        </div>
                        <ul class="nav navbar-nav text-capitalize ">
                            <li class="dropdown">
                                <a data-toggle="dropdown" ng-if="currentSport"  class="text-big"><b class="caret"></b> 
                                    {{currentSport.name}}
                                </a>
                                <a data-toggle="dropdown" ng-if="!currentSport"  class="text-big">
                                    <b class="caret"></b> 
                                    All sports
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a href="#/#/" ng-click="setCurrentSport(null)">All sports</a></li>
                                    <li ng-repeat="sport in sports">
                                        <a ng-href="#/sports/{{sport.name}}" ng-click="setCurrentSport(sport)">
                                            {{sport.name}}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <!--<li><a href=""><span class="glyphicon glyphicon-map-marker"></span> Best of</a></li>-->
                            <li ng-if="isAuthed"><a href="#/video/add"><span class="glyphicon glyphicon-plus-sign"></span></a></li>
                            <li ng-if="!isAuthed"><a href="#/login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
                            <li ng-if="!isAuthed"><a href="#/signup">Sign up</a></li>
                            <li ng-if="isAuthed" class="dropdown">
                                <a class="" data-toggle="dropdown" >
                                    <span class="glyphicon glyphicon-cog"></span>
                                </a>
                                <ul class="dropdown-menu">
                                    <!--<li> <a href="#/users/profile"><span class="glyphicon glyphicon-user"></span> Profile</a></li>-->
                                    <li> <a href="#/users/settings"><span class="glyphicon glyphicon-cog"></span> Settings</a></li>
                                    <li ng-click="logout()"><a href="#/users/login"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-secondary padding-sm-side">
                        <!--
                        <div class="page-title">
                            <h3 class="title text-capitalize">
                                {{playerData.title}}
                            </h3>
                        </div>
                        -->
                        <form class="navbar-form" role="search">
                            <div  class="input-group">
                                <ui-select 
                                    id="SearchBar"
                                    ng-model="search.tag" 
                                    theme="bootstrap"
                                    reset-search-input="false"
                                    style="min-width:300px;">
                                    <ui-select-match placeholder="Trick name" style="text-transform: capitalize;" >
                                        <span class="text-bold">{{$select.selected.name}} </span>
                                        <span class="">
                                            ({{$select.selected.sport_name}} - {{$select.selected.category_name}})
                                        </span>
                                    </ui-select-match>
                                    <ui-select-choices
                                        repeat="tag in searchTags"
                                        refresh="refreshSearchedTags($select.search)"
                                        refresh-delay="500">
                                        <div class="clearfix">
                                            <div class="col-xs-10" style="text-transform: capitalize;"  >
                                                <span class="text-bold">{{tag.name}}</span> <br/>
                                                <span class="">{{tag.sport_name}}</span> - 
                                                <span class="">{{tag.category_name}}</span>
                                            </div>
                                            <div class="col-xs-2" style="overflow: hidden;" >
                                                <span class="text-big">{{tag.count_ref}}</span>
                                            </div>
                                        </div>
                                    </ui-select-choices>
                                </ui-select>
                                <div class="input-group-btn" style="width:1%">
                                    <button class="btn btn-default" type="submit">
                                        <span class="glyphicon glyphicon-search"></span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-sm-6 nopadding" ng-if="showVideoPlayer" >
                    <table class="table-current-trick" style="width: 100%;text-align: center; min-height: 100px;"  >
                        <tbody>
                            <tr>
                                <td  ng-if="playerData.currentTag"
                                     ng-click="prevTrick()"
                                    ng-class="{disabled: !videoTagData.hasPrev()}"
                                    class="toggle-list-tricks player-prev-trick" >
                                    <a  href="" 
                                        class="text-big">
                                        <span class="glyphicon glyphicon-arrow-left"></span>
                                    </a>
                                </td>
                                <td
                                     ng-if="playerData.currentTag">
                                    <div video-tag-item video-tag="playerData.currentTag"></div>
                                </td>
                                <td
                                    ng-if="playerData.currentTag"
                                    class="toggle-list-tricks" 
                                    ng-click="nextTrick()"
                                    ng-class="{disabled: !videoTagData.hasNext()}">
                                    <a href="" class="text-big">
                                        <span class="glyphicon glyphicon-arrow-right"></span>
                                    </a>
                                </td>
                                <td class="toggle-list-tricks"  ng-click="toggleListTricks()">
                                    <a href="" class="text-big"><span class="glyphicon glyphicon-list"></span></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</header>


