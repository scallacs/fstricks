<!DOCTYPE html>
<html>
    <head>
        <?= $this->Element('Common/head'); ?>

        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>

    </head>
    <body ng-app="app" ng-controller="MainController as main">

    <toaster-container toaster-options="{'close-button': true}"></toaster-container>

        <!--<base href="#/Tricker/"/>-->

        <?= $this->Element('Common/header_ajs'); ?>


        <div id="container" style="position: relative;" class="clearfix">
            
            <div page-loader is-loading="SharedData.loadingState"></div>
            
            <div id="content">
                <div ui-view></div>
            </div>
        </div>

        <?= $this->Element('Common/footer'); ?>
    </body>
</html>