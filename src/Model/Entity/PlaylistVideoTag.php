<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * PlaylistVideoTag Entity.
 *
 * @property int $playlist_id
 * @property \App\Model\Entity\Playlist $playlist
 * @property int $video_tag_id
 * @property \App\Model\Entity\VideoTag $video_tag
 * @property int $position
 */
class PlaylistVideoTag extends Entity
{

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
        'playlist_id' => false,
        'video_tag_id' => false,
    ];
}
