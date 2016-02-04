<!DOCTYPE html>
<html>
    <head>
        <?= $this->Element('Common/head'); ?>

        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>

    </head>
    <body ng-app="DefaultModule" ng-controller="MainController">
        <!--<base href="#/Tricker/"/>-->

        <?= $this->Element('Common/header_ajs'); ?>


        <div id="container" style="position: relative;" class="clearfix">
            <div class="loading-spiner-holder" id="overlay" data-loading >
                <div class="loading-spiner">
                    <img id="loading" src="http://bit.ly/pMtW1K" />
                </div>
            </div>
            <div id="content">

                <div ng-class="playerData.extra_class">
                    <div ng-if="playerData.visible" class="full-player">

                        <div ng-show="videoTagData.data.length === 0 && !videoTagData.loading" 
                             class="pick-video-message">
                            <p>
                                Oups, there is nothing to show for this sport... 
                            <p/>
                            <p class="text-center">
                                <a href="#/video/add"> Add tricks now</a>
                            </p>
                        </div>
                        <div ng-if="videoTagData.data.length > 0">
                            <div class="nopadding player-container"  ng-show="playerData.data.video_url"  >
                                <div class="iframe-wrapper res-16by9">   
                                    <youtube
                                        player-data="playerData" frameborder="0"></youtube> 

                                </div>
                            </div>
                            <div ng-show="!playerData.data.video_url">
                                <p class="pick-video-message" >
                                    Pick a trick to play<br/>
                                    <span class="text-muted"><a href="#/video/add"> or create new ones</a></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list-tricks" ng-show="playerData.showListTricks">

                    <div
                        infinite-scroll='videoTagData.loadNextPage()' 
                        infinite-scroll-disabled='videoTagData.disabled || videoTagData.loading' 
                        infinite-scroll-distance='1'>
                        <div ng-repeat="videoTag in videoTagData.data">
                            <div class="col-sm-6 nopadding">
                                <div video-tag-item video-tag="videoTag" player-data="playerData"></div>
                                <!--<div ng-include="'html/VideoTags/item.html'"></div>-->
                            </div>
                        </div>

                        <div ng-show='videoTagData.loading' class="text-center padding-sm">
                            Loading data...
                        </div>
                    </div>

                </div>
                <?= $this->fetch('content') ?>
            </div>
        </div>

        <?= $this->Element('Common/footer'); ?>
    </body>
</html>