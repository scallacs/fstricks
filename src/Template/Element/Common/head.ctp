<?= $this->Html->charset() ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--<meta http-equiv="X-UA-Compatible" content="IE=9" />-->

<title>
    <?php echo \Cake\Core\Configure::read('Company.title'); ?>
</title>

<?= $this->Html->meta('icon', 'img/favicon.png'); ?>

<script>
    var WEBROOT_FULL = '<?= \Cake\Routing\Router::url('/', true); ?>';
    var API_BASE_URL = '<?= \Cake\Routing\Router::url('/api', true); ?>';
    var TEMPLATE_URL = '<?= \Cake\Routing\Router::url('/js/src', true); ?>';
    var APIS = {
        facebook: '<?= \Cake\Core\Configure::read('Facebook.id');?>',
        youtube: '<?= \Cake\Core\Configure::read('Youtube.key');?>'
    };
</script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/1.1.0/toaster.min.css" rel="stylesheet" />

<?php if (!\Cake\Core\Configure::read('debug')) { ?>
    <?= $this->Html->css('style.css') ?>
<?php } else { ?>
    <?= $this->Html->css('select.css'); ?> 
    <?= $this->Html->css('bootstrap.css') ?>
    <?= $this->Html->css('base.css') ?>
<?php } ?>

<?= $this->Html->script('https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-resource.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-cookies.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-messages.min.js"); ?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/1.1.0/toaster.min.js"></script>

<?php if (\Cake\Core\Configure::read('debug')) { ?>
    <?= $this->Html->script("lib/jquery-ui.min.js"); ?> 
    <?= $this->Html->script('lib/bootstrap.min.js'); ?>
    <?= $this->Html->script("lib/ui-bootstrap-custom-tpls-0.14.3.min.js"); ?>
    <?= $this->Html->script("lib/slider.min.js"); ?>
    <?= $this->Html->script("debug/froogaloop.js"); ?>
<?php } else { ?>
    <?= $this->Html->script("https://f.vimeocdn.com/js/froogaloop2.min.js"); ?>
    <?= $this->Html->script('lib.js'); ?>
<?php } ?>

<?php if (\Cake\Core\Configure::read('debug')) { ?>
    <?php // echo  $this->Html->script("components/lodash/dist/lodash.min.js"); ?> 
    <?= $this->Html->script('components/jquery-timeago/jquery.timeago.js'); ?> 
    <?= $this->Html->script("components/angular-ui-router/release/angular-ui-router.min"); ?>
    <?= $this->Html->script("components/angular-simple-logger/dist/angular-simple-logger.min.js"); ?> 
    <?= $this->Html->script('components/ui-select/dist/select.min.js'); ?>   
    <?= $this->Html->script("components/ng-file-upload/ng-file-upload-shim.min.js"); ?>
    <?= $this->Html->script("components/ng-file-upload/ng-file-upload.min.js"); ?>
    <?= $this->Html->script("components/angular-socialshare/angular-socialshare.min.js"); ?>  
    <?= $this->Html->script("components/satellizer/satellizer.min.js"); ?>                    
    <?= $this->Html->script("components/angular-utils-pagination/dirPagination.js"); ?>        
    <?= $this->Html->script("components/ngInfiniteScroll/build/ng-infinite-scroll.min.js"); ?>
    <?= $this->Html->script("components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js"); ?>
<?php } else { ?>
    <?= $this->Html->script('components.js'); ?>
<?php } ?>

<?php if (\Cake\Core\Configure::read('debug')) { ?>
    <?= $this->Html->script('src/shared/shared.module'); ?>
    <?= $this->Html->script('src/shared/directives/copy-this-link.directive'); ?>
    <?= $this->Html->script('src/shared/directives/up-down-points.directive'); ?>
    <?= $this->Html->script('src/shared/directives/removable-item.directive'); ?>
    <?= $this->Html->script('src/shared/directives/show-more.directive'); ?>
    <?= $this->Html->script('src/shared/form/shared.form.module'); ?>
    <?= $this->Html->script('src/shared/form/servererror.directive'); ?>
    <?= $this->Html->script('src/shared/form/server-form.directive'); ?>
    <?= $this->Html->script('src/shared/form/password-strength.directive'); ?>
    <?= $this->Html->script('src/shared/form/password-match.directive'); ?>
    <?= $this->Html->script('src/shared/form/ft-unique.factory'); ?>
    <?= $this->Html->script('src/shared/youtube/shared.youtube.module'); ?>
    <?= $this->Html->script('src/shared/youtube/youtube-video-info.factory'); ?>
    <?= $this->Html->script('src/shared/vimeo/shared.vimeo.module'); ?>
    <?= $this->Html->script('src/shared/vimeo/vimeo-info.factory'); ?>
    <?= $this->Html->script('src/shared/filters/time.filter'); ?>
    <?= $this->Html->script('src/shared/directives/page-loader.directive'); ?>
    <?= $this->Html->script('src/core/app.core.module'); ?>
    <?= $this->Html->script('src/account/app.account.module'); ?>
    <?= $this->Html->script('src/account/form-login.directive'); ?>
    <?= $this->Html->script('src/layout/app.layout.module'); ?>
    <?= $this->Html->script('src/layout/topnav.directive'); ?>
    <?= $this->Html->script('src/layout/top-search.directive'); ?>
    <?= $this->Html->script('src/rider/app.rider.module'); ?>
    <?= $this->Html->script('src/rider/form-add-rider.directive'); ?>
    <?= $this->Html->script('src/rider/rider-item.directive'); ?>
    <?= $this->Html->script('src/rider/rider-box.directive'); ?>
    <?= $this->Html->script('src/player/app.player.module'); ?>
    <?= $this->Html->script('src/player/player-nav.directive'); ?>
    <?= $this->Html->script('src/player/player-container.directive'); ?>
    <?= $this->Html->script('src/player/player-bar.directive'); ?>
    <?= $this->Html->script('src/player/youtube.directive'); ?>
    <?= $this->Html->script('src/player/vimeo.directive'); ?>
    <?= $this->Html->script('src/player/video-item.directive'); ?>
    <?= $this->Html->script('src/player/playlist-item.directive'); ?>
    <?= $this->Html->script('src/player/rule-provider-video-id.directive'); ?>
    <?= $this->Html->script('src/player/provider-video-info.factory'); ?>
    <?= $this->Html->script('src/player/playlist-form.directive'); ?>
    <?= $this->Html->script('src/tag/app.tag.module'); ?>
    <?= $this->Html->script('src/tag/trick-list.directive'); ?>
    <?= $this->Html->script('src/tag/video-tag-item.directive'); ?>
    <?= $this->Html->script('src/tag/add-video-tag.controller'); ?>
    <?= $this->Html->script('src/page/app.page.module'); ?>
    <?= $this->Html->script('src/app.config.module'); ?>
    <?= $this->Html->script('src/app.module'); ?>
<?php } else { ?>
    <?= $this->Html->script('app.js'); ?>
<?php } ?>
