<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Form->postLink(
                __('Delete'),
                ['action' => 'delete', $videoTagPoint->id],
                ['confirm' => __('Are you sure you want to delete # {0}?', $videoTagPoint->id)]
            )
        ?></li>
        <li><?= $this->Html->link(__('List Video Tag Points'), ['action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Video Tags'), ['controller' => 'VideoTags', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video Tag'), ['controller' => 'VideoTags', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="videoTagPoints form large-9 medium-8 columns content">
    <?= $this->Form->create($videoTagPoint) ?>
    <fieldset>
        <legend><?= __('Edit Video Tag Point') ?></legend>
        <?php
            echo $this->Form->input('value');
            echo $this->Form->input('users_id', ['options' => $users]);
            echo $this->Form->input('video_tag_id', ['options' => $videoTags]);
        ?>
    </fieldset>
    <?= $this->Form->button(__('Submit')) ?>
    <?= $this->Form->end() ?>
</div>
