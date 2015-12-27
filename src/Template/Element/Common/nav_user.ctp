<?php
/* ---------------------------------------------------------------------------- */
/*  CONNECTED USER */
/* ---------------------------------------------------------------------------- */
if (isset($isUserConnected) && $isUserConnected) {
    ?>
    <li>
        <?php
        echo $this->Html->link('<span class="glyphicon glyphicon-user"></span> Admin', array(
            'controller' => 'Spots',
            'action' => 'index',
            'prefix' => 'admin',
            'plugin' => null
        ), array('escape' => false));
        ?>
    </li>  
    <li class="dropdown">
        <?php
        echo $this->Html->link($currentUser['User']['email'].' <b class="caret"></b>', array(
            'controller' => 'users',
            'action' => 'settings',
            'plugin' => null), array(
                'data-toggle' => 'dropdown',
                'class' => 'dropdown-toggle',
                'escape' => false));
        ?>
        <ul class="dropdown-menu">
            <li>
                <?php
                echo $this->Html->link('<span class="glyphicon glyphicon-user"></span> Profile', array(
                    'controller' => 'users',
                    'action' => 'profile',
                    'plugin' => null,
                    'prefix' => false
                ), array('escape' => false));
                ?>
            </li>  
            <li>
                <?php
                echo $this->Html->link('<span class="glyphicon glyphicon-cog"></span> Settings', array(
                    'controller' => 'users',
                    'action' => 'settings',
                    'plugin' => null,
                    'prefix' => false
                ), array('escape' => false));
                ?>
            </li>  
            <li>
                <?php
                echo $this->Html->link('<span class="glyphicon glyphicon-off"></span> Logout', array(
                    'controller' => 'users',
                    'action' => 'logout',
                    'plugin' => null,
                    'prefix' => false
                ), array('escape' => false));
                ?>
            </li>  
        </ul>
    </li>
<?php
/* ---------------------------------------------------------------------------- */
/*  NOT CONNECTED USER USER */
/* ---------------------------------------------------------------------------- */
} else { ?>
    <li>
        <?php echo $this->Html->link('Login', array('controller' => 'users', 'action' => 'login', 'plugin' => null, 'prefix' => false)); ?>
    </li>
<?php } ?>