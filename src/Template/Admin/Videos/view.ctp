<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('Edit Video'), ['action' => 'edit', $video->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Video'), ['action' => 'delete', $video->id], ['confirm' => __('Are you sure you want to delete # {0}?', $video->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Videos'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video'), ['action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Video Providers'), ['controller' => 'VideoProviders', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video Provider'), ['controller' => 'VideoProviders', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Videos'), ['controller' => 'Videos', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video'), ['controller' => 'Videos', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Video Tags'), ['controller' => 'VideoTags', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video Tag'), ['controller' => 'VideoTags', 'action' => 'add']) ?> </li>
    </ul>
</nav>
<div class="videos view large-9 medium-8 columns content">
    <h3><?= h($video->id) ?></h3>
    <table class="vertical-table">
        <tr>
            <th><?= __('Video Id') ?></th>
            <td><?= h($video->video_url) ?></td>
        </tr>
        <tr>
            <th><?= __('Video Provider') ?></th>
            <td><?= $video->has('video_provider') ? $this->Html->link($video->video_provider->name, ['controller' => 'VideoProviders', 'action' => 'view', $video->video_provider->name]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('User') ?></th>
            <td><?= $video->has('user') ? $this->Html->link($video->user->username, ['controller' => 'Users', 'action' => 'view', $video->user->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Id') ?></th>
            <td><?= $this->Number->format($video->id) ?></td>
        </tr>
        <tr>
            <th><?= __('Count Tags') ?></th>
            <td><?= $this->Number->format($video->count_tags) ?></td>
        </tr>
    </table>
    <div class="related">
        <h4><?= __('Related Videos') ?></h4>
        <?php if (!empty($video->videos)): ?>
        <table cellpadding="0" cellspacing="0">
            <tr>
                <th><?= __('Id') ?></th>
                <th><?= __('Video Id') ?></th>
                <th><?= __('Source Id') ?></th>
                <th><?= __('Count Tags') ?></th>
                <th><?= __('User Id') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
            <?php foreach ($video->videos as $videos): ?>
            <tr>
                <td><?= h($videos->id) ?></td>
                <td><?= h($videos->video_id) ?></td>
                <td><?= h($videos->source_id) ?></td>
                <td><?= h($videos->count_tags) ?></td>
                <td><?= h($videos->user_id) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['controller' => 'Videos', 'action' => 'view', $videos->id]) ?>

                    <?= $this->Html->link(__('Edit'), ['controller' => 'Videos', 'action' => 'edit', $videos->id]) ?>

                    <?= $this->Form->postLink(__('Delete'), ['controller' => 'Videos', 'action' => 'delete', $videos->id], ['confirm' => __('Are you sure you want to delete # {0}?', $videos->id)]) ?>

                </td>
            </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
    </div>
    <div class="related">
        <h4><?= __('Related Video Tags') ?></h4>
        <?php if (!empty($video->video_tags)): ?>
        <table cellpadding="0" cellspacing="0">
            <tr>
                <th><?= __('Id') ?></th>
                <th><?= __('Video Id') ?></th>
                <th><?= __('Tag Id') ?></th>
                <th><?= __('User Id') ?></th>
                <th><?= __('Begin') ?></th>
                <th><?= __('End') ?></th>
                <th><?= __('Created') ?></th>
                <th><?= __('Status') ?></th>
                <th><?= __('Count Points') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
            <?php foreach ($video->video_tags as $videoTags): ?>
            <tr>
                <td><?= h($videoTags->id) ?></td>
                <td><?= h($videoTags->video_id) ?></td>
                <td><?= h($videoTags->tag_id) ?></td>
                <td><?= h($videoTags->user_id) ?></td>
                <td><?= h($videoTags->begin) ?></td>
                <td><?= h($videoTags->end) ?></td>
                <td><?= h($videoTags->created) ?></td>
                <td><?= h($videoTags->status) ?></td>
                <td><?= h($videoTags->count_points) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['controller' => 'VideoTags', 'action' => 'view', $videoTags->id]) ?>

                    <?= $this->Html->link(__('Edit'), ['controller' => 'VideoTags', 'action' => 'edit', $videoTags->id]) ?>

                    <?= $this->Form->postLink(__('Delete'), ['controller' => 'VideoTags', 'action' => 'delete', $videoTags->id], ['confirm' => __('Are you sure you want to delete # {0}?', $videoTags->id)]) ?>

                </td>
            </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
    </div>
</div>
