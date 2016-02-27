<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('New Video Tag'), ['action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Videos'), ['controller' => 'Videos', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video'), ['controller' => 'Videos', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Tags'), ['controller' => 'Tags', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Tag'), ['controller' => 'Tags', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Video Tag Points'), ['controller' => 'VideoTagPoints', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video Tag Point'), ['controller' => 'VideoTagPoints', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="videoTags index large-9 medium-8 columns content">
    <h3><?= __('Video Tags') ?></h3>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th><?= $this->Paginator->sort('id') ?></th>
                <th><?= $this->Paginator->sort('video_url') ?></th>
                <th><?= $this->Paginator->sort('tag_id') ?></th>
                <th><?= $this->Paginator->sort('user_id') ?></th>
                <th><?= $this->Paginator->sort('begin') ?></th>
                <th><?= $this->Paginator->sort('end') ?></th>
                <th><?= $this->Paginator->sort('created') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($videoTags as $videoTag): ?>
            <tr>
                <td><?= $this->Number->format($videoTag->id) ?></td>
                <td><?= $videoTag->has('video') ? $this->Html->link($videoTag->video->id, ['controller' => 'Videos', 'action' => 'view', $videoTag->video->id]) : '' ?></td>
                <td><?= $videoTag->has('tag') ? $this->Html->link($videoTag->tag->name, ['controller' => 'Tags', 'action' => 'view', $videoTag->tag->id]) : '' ?></td>
                <td><?= $videoTag->has('user') ? $this->Html->link($videoTag->user->username, ['controller' => 'Users', 'action' => 'view', $videoTag->user->id]) : '' ?></td>
                <td><?= $this->Number->format($videoTag->begin) ?></td>
                <td><?= $this->Number->format($videoTag->end) ?></td>
                <td><?= h($videoTag->created) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['action' => 'view', $videoTag->id]) ?>
                    <?= $this->Html->link(__('Edit'), ['action' => 'edit', $videoTag->id]) ?>
                    <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $videoTag->id], ['confirm' => __('Are you sure you want to delete # {0}?', $videoTag->id)]) ?>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <div class="paginator">
        <ul class="pagination">
            <?= $this->Paginator->prev('< ' . __('previous')) ?>
            <?= $this->Paginator->numbers() ?>
            <?= $this->Paginator->next(__('next') . ' >') ?>
        </ul>
        <p><?= $this->Paginator->counter() ?></p>
    </div>
</div>
