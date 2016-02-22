<?= $this->Html->charset() ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>
    <?= $this->fetch('title') ?>
</title>

<script>
    const WEBROOT = '<?= $this->request->webroot; ?>';
            const WEBROOT_FULL = '<?= \Cake\Routing\Router::url('/', true); ?>';</script>
<?= $this->Html->meta('icon') ?>

<link rel="stylesheet" href="js/components/ui-select/dist/select.min.css">
<link rel="stylesheet" href="js/components/AngularJS-Toaster/toaster.min.css">

<!--<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.css">-->


<?= $this->Html->css('bootstrap.css') ?>
<?= $this->Html->css('ui-bootstrap.css') ?>
<?= $this->Html->css('base.css') ?>
<?= $this->Html->css('jquery-ui.min.css'); ?>  <!-- ONLY ADD SLIDER CODE -->

<?= $this->Html->script('components/jquery/dist/jquery.min.js'); ?> <!-- 2.1.4 -->
<?= $this->Html->script('components/jquery-timeago/jquery.timeago.js'); ?> <!-- 1.0.2 -->
<?= $this->Html->script('lib/bootstrap.min.js'); ?>  <!-- Can be remove if using angular ? -->

<?= $this->Html->script("components/lodash/dist/lodash.min.js"); ?> <!-- Used by the slider ? -->

<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-resource.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-route.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-cookies.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-messages.min.js"); ?>

<?= $this->Html->script("https://f.vimeocdn.com/js/froogaloop2.min.js"); ?>

<!--
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-aria.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.js"></script>
-->
<?= $this->Html->script("components/angular-ui-router/release/angular-ui-router.min"); ?>

<?= $this->Html->script("components/AngularJS-Toaster/toaster.min"); ?>

<?= $this->Html->script("components/angular-simple-logger/dist/angular-simple-logger.min.js"); ?> <!-- Use online lib ? -->
<?= $this->Html->script("lib/ui-bootstrap-custom-tpls-0.14.3.min.js"); ?>
<?= $this->Html->script("lib/slider.js"); ?>
<?= $this->Html->script("components/jquery-ui/jquery-ui.min.js"); ?>
<?= $this->Html->script('components/ui-select/dist/select.min.js'); ?>   

<?= $this->Html->script('src/shared/shared.module'); ?>
<?= $this->Html->script('src/shared/directives/copy-this-link.directive'); ?>
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

<?= $this->Html->script('src/shared/time.filter'); ?>
<?= $this->Html->script('src/shared/directives/page-loader.directive'); ?>

<?= $this->Html->script('src/core/app.core.module'); ?>

<?= $this->Html->script('src/account/app.account.module'); ?>
<?= $this->Html->script('src/account/form-login.directive'); ?>

<?= $this->Html->script('src/layout/app.layout.module'); ?>
<?= $this->Html->script('src/layout/topnav.directive'); ?>
<?= $this->Html->script('src/layout/top-search.directive'); ?>

<?= $this->Html->script("components/ng-file-upload/ng-file-upload-shim.min.js"); ?>
<?= $this->Html->script("components/ng-file-upload/ng-file-upload.min.js"); ?>
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
<?= $this->Html->script('src/player/rule-provider-video-id.directive'); ?>
<?= $this->Html->script('src/player/provider-video-info.factory'); ?>
<?= $this->Html->script('src/player/video-tag-accuracy-rate.directive'); ?>

<?= $this->Html->script('src/tag/app.tag.module'); ?>
<?= $this->Html->script('src/tag/trick-list.directive'); ?>
<?= $this->Html->script('src/tag/video-tag-item.directive'); ?>
<?= $this->Html->script('src/tag/add-video-tag.controller'); ?>

<?= $this->Html->script('src/page/app.page.module'); ?>

<?= $this->Html->script('src/app.config.module'); ?>
<?= $this->Html->script('src/app.module'); ?>

<?= $this->Html->script("components/angular-socialshare/angular-socialshare.min.js"); ?>   <!-- Can be lighter -->
<?= $this->Html->script("components/satellizer/satellizer.min.js"); ?>                     <!-- Can be lighter -->
<?= $this->Html->script("components/angular-utils-pagination/dirPagination.js"); ?>         <!-- Use mimified -->
<?= $this->Html->script("components/ngInfiniteScroll/build/ng-infinite-scroll.min.js"); ?>


<link href="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/1.1.0/toaster.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/1.1.0/toaster.min.js"></script>