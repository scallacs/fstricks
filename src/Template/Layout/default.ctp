<!DOCTYPE html>
<html>
    <head>
        <?= $this->Element('Common/head'); ?>

        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>

    </head>
    <body ng-app="DefaultModule" ng-controller="MainController">
    <base href="/Tricker/"/>

    <?= $this->Element('Common/header_ajs'); ?>

    <div id="container" style="position: relative;">
        <div class="loading-spiner-holder" id="overlay" data-loading >
            <div class="loading-spiner">
                <img id="loading" src="http://bit.ly/pMtW1K" />
            </div>
        </div>
        <div id="content">
            <div ng-if="showVideoPlayer" >

                <div class="col-sm-8 nopadding player-container"  style="position:fixed">
                    <div class="iframe-wrapper res-16by9">   
                        <youtube ng-show="playerInfo.video_url" 
                                 player-video="playerInfo" frameborder="0"></youtube> 

                        <div ng-show="!playerInfo.video_url && video.video_tags.length > 0">
                            <p class="pick-video-message" >
                                Pick a trick to play<br/>
                                <span class="text-muted"><a href="video/add"> or create new ones</a></span>
                            </p>
                        </div>
                        <div ng-show="!playerInfo.video_url && video.video_tags.length === 0" class="pick-video-message">
                            <p>
                                Oups, there is nothing to show for this sport... 
                            <p/>
                            <p class="text-center">
                                <a href="video/add"> Add tricks now</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-sm-offset-8 col-sm-4 nopadding" ng-if="showVideoPlayer">
                    <div ng-repeat="videoTag in video.video_tags">
                        <div ng-include="'html/VideoTags/item.html'"></div>
                    </div>
                </div>
            </div>
            <?= $this->fetch('content') ?>
        </div>
    </div>

    <?= $this->Element('Common/footer'); ?>
</body>
</html>