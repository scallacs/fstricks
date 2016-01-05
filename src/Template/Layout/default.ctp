<!DOCTYPE html>
<html>
    <head>
        <?= $this->Element('Common/head'); ?>

        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>

    </head>
    <body ng-app="DefaultModule" ng-controller="MainController">

        <?= $this->Element('Common/header_ajs'); ?>

        <div id="container" style="position: relative;">
            <div class="loading-spiner-holder" id="overlay" data-loading >
                <div class="loading-spiner">
                    <img id="loading" src="http://bit.ly/pMtW1K" />
                </div>
            </div>
            <div id="content" class="">
                <div class="row"  ng-show="showVideoPlayer" >

                    <div class="col-md-8 nopadding">
                        <div>
                            <youtube   
                                player-video="playerInfo"
                                height="player.height" 
                                width="player.height" ></youtube> 
                        </div>
                    </div>
                    <div class="col-md-4 nopadding" >
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