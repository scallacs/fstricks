<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Playlist Entity.
 *
 * @property int $id
 * @property string $title
 * @property string $description
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property string $status
 * @property int $count_points
 * @property \App\Model\Entity\PlaylistVideoTag[] $playlist_video_tags
 */
class Playlist extends Entity
{
    
    const STATUS_PUBLIC = 'public';
    const STATUS_PRIVATE = 'private';
    const STATUS_BLOCKED = 'blocked';

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        '*' => true,
        'id' => false,
    ];
}
