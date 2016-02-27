<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Form->postLink(
                __('Delete'),
                ['action' => 'delete', $playlist->id],
                ['confirm' => __('Are you sure you want to delete # {0}?', $playlist->id)]
            )
        ?></li>
        <li><?= $this->Html->link(__('List Playlists'), ['action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Playlist Video Tags'), ['controller' => 'PlaylistVideoTags', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Playlist Video Tag'), ['controller' => 'PlaylistVideoTags', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="playlists form large-9 medium-8 columns content">
    <?= $this->Form->create($playlist) ?>
    <fieldset>
        <legend><?= __('Edit Playlist') ?></legend>
        <?php
            echo $this->Form->input('title');
            echo $this->Form->input('description');
            echo $this->Form->input('user_id', ['options' => $users, 'empty' => true]);
            echo $this->Form->input('status');
            echo $this->Form->input('count_points');
        ?>
    </fieldset>
    <?= $this->Form->button(__('Submit')) ?>
    <?= $this->Form->end() ?>
</div>
