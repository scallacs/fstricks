<?php use Cake\Core\Configure; ?>

<nav role="navigation" class="navbar navbar-default">

    <!-- ****************************** TOP NAV *******************************-->
    <div class="container-fluid pull-right" id="NavBarUser" >        
        <!-- Collection of nav links and other content for toggling -->
        <ul class="navbar-header  list-unstyled list-inline">           
            <?php echo $this->Element('Common/nav_user'); ?>
        </ul>
    </div>

    <!-- ****************************** TOP NAV *******************************-->
    <div class="container-fluid" id="NavBarTop">

        <!-- Collection of nav links and other content for toggling -->
        <div id="navbarCollapse" class="collapse navbar-collapse">
            
            <ul class="nav navbar-nav">
                <?php if ($this->request->prefix === 'admin'){ ?>
                    <li><?= $this->Html->link('Manage', ['controller' => 'spots', 'action' => 'index', 'prefix' => 'admin']);?></li>
                    <li><?= $this->Html->link('Generate', ['controller' => 'spots', 'action' => 'generate', 'prefix' => 'admin']);?></li>
                    <li><?= $this->Html->link('Places', ['controller' => 'places', 'action' => 'index', 'prefix' => 'admin']);?></li>
                <?php } else { ?>
                    <li><?= $this->Html->link('Explore', ['controller' => 'spots', 'action' => 'map', 'prefix' => false]);?></li>
                    <li><?= $this->Html->link('Post', ['controller' => 'spots', 'action' => 'add', 'prefix' => false]);?></li>
                    <li><?= $this->Html->link('List', ['controller' => 'spots', 'action' => 'index', 'prefix' => false]);?></li>
                    <li><?= $this->Html->link('Places', ['controller' => 'places', 'action' => 'index', 'prefix' => false]);?></li>
                <?php } ?>
            </ul>

        </div>

<?php echo $this->fetch('header-content'); ?>
    </div>
</nav>
