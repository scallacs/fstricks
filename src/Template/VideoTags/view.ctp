<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('Edit Video Tag'), ['action' => 'edit', $videoTag->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Video Tag'), ['action' => 'delete', $videoTag->id], ['confirm' => __('Are you sure you want to delete # {0}?', $videoTag->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Video Tags'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video Tag'), ['action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Videos'), ['controller' => 'Videos', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video'), ['controller' => 'Videos', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Tags'), ['controller' => 'Tags', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Tag'), ['controller' => 'Tags', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Video Tag Points'), ['controller' => 'VideoTagPoints', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video Tag Point'), ['controller' => 'VideoTagPoints', 'action' => 'add']) ?> </li>
    </ul>
</nav>
<div class="videoTags view large-9 medium-8 columns content">
    <h3><?= h($videoTag->id) ?></h3>
    <table class="vertical-table">
        <tr>
            <th><?= __('Video') ?></th>
            <td><?= $videoTag->has('video') ? $this->Html->link($videoTag->video->id, ['controller' => 'Videos', 'action' => 'view', $videoTag->video->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Tag') ?></th>
            <td><?= $videoTag->has('tag') ? $this->Html->link($videoTag->tag->name, ['controller' => 'Tags', 'action' => 'view', $videoTag->tag->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('User') ?></th>
            <td><?= $videoTag->has('user') ? $this->Html->link($videoTag->user->username, ['controller' => 'Users', 'action' => 'view', $videoTag->user->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Id') ?></th>
            <td><?= $this->Number->format($videoTag->id) ?></td>
        </tr>
        <tr>
            <th><?= __('Begin') ?></th>
            <td><?= $this->Number->format($videoTag->begin) ?></td>
        </tr>
        <tr>
            <th><?= __('End') ?></th>
            <td><?= $this->Number->format($videoTag->end) ?></td>
        </tr>
        <tr>
            <th><?= __('Count Points') ?></th>
            <td><?= $this->Number->format($videoTag->count_points) ?></td>
        </tr>
        <tr>
            <th><?= __('Created') ?></th>
            <td><?= h($videoTag->created) ?></td>
        </tr>
    </table>
    <div class="row">
        <h4><?= __('Status') ?></h4>
        <?= $this->Text->autoParagraph(h($videoTag->status)); ?>
    </div>
    <div class="related">
        <h4><?= __('Related Video Tag Points') ?></h4>
        <?php if (!empty($videoTag->video_tag_points)): ?>
        <table cellpadding="0" cellspacing="0">
            <tr>
                <th><?= __('Id') ?></th>
                <th><?= __('Value') ?></th>
                <th><?= __('Users Id') ?></th>
                <th><?= __('Video Tag Id') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
            <?php foreach ($videoTag->video_tag_points as $videoTagPoints): ?>
            <tr>
                <td><?= h($videoTagPoints->id) ?></td>
                <td><?= h($videoTagPoints->value) ?></td>
                <td><?= h($videoTagPoints->users_id) ?></td>
                <td><?= h($videoTagPoints->video_tag_id) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['controller' => 'VideoTagPoints', 'action' => 'view', $videoTagPoints->id]) ?>

                    <?= $this->Html->link(__('Edit'), ['controller' => 'VideoTagPoints', 'action' => 'edit', $videoTagPoints->id]) ?>

                    <?= $this->Form->postLink(__('Delete'), ['controller' => 'VideoTagPoints', 'action' => 'delete', $videoTagPoints->id], ['confirm' => __('Are you sure you want to delete # {0}?', $videoTagPoints->id)]) ?>

                </td>
            </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
    </div>
</div>
