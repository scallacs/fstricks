<!DOCTYPE html>
<html>
    <head>
        <?= $this->Element('Common/head'); ?>

        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>

    </head>
    <body ng-app="app" ng-controller="MainController">
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
                <!--
                <div ng-show="playerData.visible" class="full-player" player-container></div>
                <div class="list-tricks" trick-list ng-show="playerData.showListTricks"></div>
                -->

                <div ng-view></div>
            </div>
        </div>

        <?= $this->Element('Common/footer'); ?>
    </body>
</html>