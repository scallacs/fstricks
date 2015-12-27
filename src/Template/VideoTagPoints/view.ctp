<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('Edit Video Tag Point'), ['action' => 'edit', $videoTagPoint->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Video Tag Point'), ['action' => 'delete', $videoTagPoint->id], ['confirm' => __('Are you sure you want to delete # {0}?', $videoTagPoint->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Video Tag Points'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video Tag Point'), ['action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Video Tags'), ['controller' => 'VideoTags', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video Tag'), ['controller' => 'VideoTags', 'action' => 'add']) ?> </li>
    </ul>
</nav>
<div class="videoTagPoints view large-9 medium-8 columns content">
    <h3><?= h($videoTagPoint->id) ?></h3>
    <table class="vertical-table">
        <tr>
            <th><?= __('Value') ?></th>
            <td><?= h($videoTagPoint->value) ?></td>
        </tr>
        <tr>
            <th><?= __('User') ?></th>
            <td><?= $videoTagPoint->has('user') ? $this->Html->link($videoTagPoint->user->username, ['controller' => 'Users', 'action' => 'view', $videoTagPoint->user->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Video Tag') ?></th>
            <td><?= $videoTagPoint->has('video_tag') ? $this->Html->link($videoTagPoint->video_tag->id, ['controller' => 'VideoTags', 'action' => 'view', $videoTagPoint->video_tag->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Id') ?></th>
            <td><?= $this->Number->format($videoTagPoint->id) ?></td>
        </tr>
    </table>
</div>
