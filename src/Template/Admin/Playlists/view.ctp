<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('Edit Playlist'), ['action' => 'edit', $playlist->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Playlist'), ['action' => 'delete', $playlist->id], ['confirm' => __('Are you sure you want to delete # {0}?', $playlist->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Playlists'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Playlist'), ['action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Playlist Video Tags'), ['controller' => 'PlaylistVideoTags', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Playlist Video Tag'), ['controller' => 'PlaylistVideoTags', 'action' => 'add']) ?> </li>
    </ul>
</nav>
<div class="playlists view large-9 medium-8 columns content">
    <h3><?= h($playlist->title) ?></h3>
    <table class="vertical-table">
        <tr>
            <th><?= __('Title') ?></th>
            <td><?= h($playlist->title) ?></td>
        </tr>
        <tr>
            <th><?= __('Description') ?></th>
            <td><?= h($playlist->description) ?></td>
        </tr>
        <tr>
            <th><?= __('User') ?></th>
            <td><?= $playlist->has('user') ? $this->Html->link($playlist->user->username, ['controller' => 'Users', 'action' => 'view', $playlist->user->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Id') ?></th>
            <td><?= $this->Number->format($playlist->id) ?></td>
        </tr>
        <tr>
            <th><?= __('Count Points') ?></th>
            <td><?= $this->Number->format($playlist->count_points) ?></td>
        </tr>
        <tr>
            <th><?= __('Created') ?></th>
            <td><?= h($playlist->created) ?></td>
        </tr>
        <tr>
            <th><?= __('Modified') ?></th>
            <td><?= h($playlist->modified) ?></td>
        </tr>
    </table>
    <div class="row">
        <h4><?= __('Status') ?></h4>
        <?= $this->Text->autoParagraph(h($playlist->status)); ?>
    </div>
    <div class="related">
        <h4><?= __('Related Playlist Video Tags') ?></h4>
        <?php if (!empty($playlist->playlist_video_tags)): ?>
        <table cellpadding="0" cellspacing="0">
            <tr>
                <th><?= __('Playlist Id') ?></th>
                <th><?= __('Video Tag Id') ?></th>
                <th><?= __('Order') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
            <?php foreach ($playlist->playlist_video_tags as $playlistVideoTags): ?>
            <tr>
                <td><?= h($playlistVideoTags->playlist_id) ?></td>
                <td><?= h($playlistVideoTags->video_tag_id) ?></td>
                <td><?= h($playlistVideoTags->order) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['controller' => 'PlaylistVideoTags', 'action' => 'view', $playlistVideoTags->playlist_id]) ?>

                    <?= $this->Html->link(__('Edit'), ['controller' => 'PlaylistVideoTags', 'action' => 'edit', $playlistVideoTags->playlist_id]) ?>

                    <?= $this->Form->postLink(__('Delete'), ['controller' => 'PlaylistVideoTags', 'action' => 'delete', $playlistVideoTags->playlist_id], ['confirm' => __('Are you sure you want to delete # {0}?', $playlistVideoTags->playlist_id)]) ?>

                </td>
            </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
    </div>
</div>
