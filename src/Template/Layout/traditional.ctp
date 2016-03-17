<!DOCTYPE html>
<html>
    <head>
        <?= $this->fetch('meta') ?>
        <?= $this->fetch('css') ?>
        <?= $this->fetch('script') ?>
        
        <?= $this->Element('Common/head'); ?>
    </head>
    
    <body>
        <div id="container" style="position: relative;" class="clearfix">
            <div id="content">
                <?= $this->fetch('content'); ?>
            </div>
        </div>

        <?= $this->Element('Common/footer'); ?>
    </body>
</html>