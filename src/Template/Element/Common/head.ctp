<?= $this->Html->charset() ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>
    <?= $this->fetch('title') ?>
</title>

<script>
    const DS = '/';
    const WEBROOT = '<?= $this->request->webroot; ?>';
    const WEBROOT_FULL = '<?= \Cake\Routing\Router::url('/', true); ?>';
    const IMAGE_FOLDER = WEBROOT_FULL + 'img' + DS;
    const HTML_FOLDER = WEBROOT_FULL + 'html' + DS;
                    
</script>
<?= $this->Html->meta('icon') ?>

<?= $this->Html->css('bootstrap.css') ?>
<?= $this->Html->css('ui-bootstrap.css') ?>
<?= $this->Html->css('base.css') ?>
<?= $this->Html->css('select.min.css'); ?>  
<?= $this->Html->css('jquery-ui.min.css'); ?>  <!-- ONLY ADD SLIDER CODE -->

<?= $this->Html->script('node_modules/jquery/dist/jquery.min.js'); ?> <!-- 2.1.4 -->
<?= $this->Html->script('node_modules/timeago/jquery.timeago.js'); ?> <!-- 1.0.2 -->
<?= $this->Html->script('lib/bootstrap.min.js'); ?>  <!-- Can be remove if using angular ? -->

<?= $this->Html->script('src/utils/util.js'); ?>
<?= $this->Html->script('src/utils/cakephp.util.js'); ?>         


<?= $this->Html->script("node_modules/lodash/lodash.js"); ?> <!-- Used by the slider ? -->

<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-resource.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-animate.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-route.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-cookies.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-messages.min.js"); ?>

<?= $this->Html->script("node_modules/angular-simple-logger/dist/angular-simple-logger.min.js"); ?> <!-- Use online lib ? -->
<?= $this->Html->script("lib/ui-bootstrap-custom-tpls-0.14.3.min.js"); ?>
<?= $this->Html->script("lib/slider.js"); ?>
<?= $this->Html->script('lib/select.min.js'); ?>   
<?= $this->Html->script("bower_components/jquery-ui/jquery-ui.min.js"); ?>


<?= $this->Html->script('src/CommonModule'); ?>
<?= $this->Html->script('src/DefaultModule'); ?>

<?= $this->Html->script("node_modules/angular-socialshare/angular-socialshare.min.js"); ?>   <!-- Can be lighter -->
<?= $this->Html->script("node_modules/satellizer/satellizer.min.js"); ?>                     <!-- Can be lighter -->
<?= $this->Html->script("bower_components/message-center/message-center.js"); ?>         
<?= $this->Html->script("node_modules/angular-utils-pagination/dirPagination.js"); ?>         <!-- Use mimified -->
<?= $this->Html->script("node_modules/ng-infinite-scroll/build/ng-infinite-scroll.min.js"); ?>
<?= $this->Html->script("node_modules/ng-flow/dist/ng-flow-standalone.min"); ?>
