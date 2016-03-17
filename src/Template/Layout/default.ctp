<!DOCTYPE html>
<html>
    <head>
        <?= $this->Element('Common/head'); ?>
        <?= $this->Element('Common/scripts'); ?>

        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>

    </head>
    <body ng-app="app" ng-controller="MainController as main" id="ng-app">
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

    <?php if (\Cake\Core\Configure::read('user_feedback')) { ?>
        <angular-feedback options="{ajaxURL: '<?php \Cake\Core\Router::url(['controller' => 'feedback', 'action' => 'send', 'prefix' => 'api']);?>'}"></angular-feedback>
    <?php } ?>

</body>
</html>