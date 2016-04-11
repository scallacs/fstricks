<!DOCTYPE html>
<html ng-app="app" ng-controller="MainController as main" id="ng-app">
    <head>
        <?= $this->Element('Common/head'); ?>
        <?= $this->Element('Common/scripts'); ?>

        <meta name="fragment" content="!">
        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>
    </head>
    <body>
    <base href="<?= \Cake\Routing\Router::url('/'); ?>"/>
    <toaster-container toaster-options="{'close-button': true}"></toaster-container>

    <?= $this->Element('Common/header_ajs'); ?>


    <div id="container" style="position: relative;" class="clearfix">

        <div page-loader is-loading="SharedData.loadingState"></div>

        <div id="content">
            <!--[if lte IE 8]>
                    <div class="pick-video-message">
                        <p>
                            Sorry but we do not support Internet Explorer 8 and below...
                        </p>
                    </div>
            <![endif]-->
            <div ui-view></div>
        </div>
    </div>

    <?= $this->Element('Common/footer'); ?>

    <?php if (\Cake\Core\Configure::read('user_feedback')) {
        ?>
        <!--<div class="feeback-container">-->
        <angular-feedback options="feedbackOptions" ng-if="authData.isAuthed()">
        </angular-feedback>
        <!--</div>-->
    <?php } ?>
</body>
</html>