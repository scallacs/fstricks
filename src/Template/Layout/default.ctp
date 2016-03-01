<!DOCTYPE html>
<html>
    <head>
        <?= $this->Element('Common/head'); ?>

        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>

    </head>
    <body ng-app="app" ng-controller="MainController as main" id="ng-app">
        <base href="<?= \Cake\Routing\Router::url('/'); ?>"/>


        <!--[if IE]>
                <div class="pick-video-message">
                    <p>
                        We do not support Internet Explorer for now but we are working on it. 
                    </p>
                    <p>
                        You can use one of the supported browser: Firefox, Chrome, Safarie, Opera.
                    </p>
                </div>
        <![endif]-->

        <toaster-container toaster-options="{'close-button': true}"></toaster-container>

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