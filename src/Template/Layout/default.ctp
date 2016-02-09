<!DOCTYPE html>
<html>
    <head>
        <?= $this->Element('Common/head'); ?>

        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>

    </head>
    <body ng-app="app" ng-controller="MainController as main">
        <!--<base href="#/Tricker/"/>-->

        <?= $this->Element('Common/header_ajs'); ?>


        <div id="container" style="position: relative;" class="clearfix">
            <!--
            <div class="loading-spiner-holder" id="overlay" data-loading >
                <div class="loading-spiner">
                    <img id="loading" src="http://bit.ly/pMtW1K" />
                </div>
            </div>-->
            
            <div id="content">
                <div class="full-player" player-container></div>
                <div class="list-tricks" trick-list></div>
                <div ng-view></div>
            </div>
        </div>

        <?= $this->Element('Common/footer'); ?>
    </body>
</html>