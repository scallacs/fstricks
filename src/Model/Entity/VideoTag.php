<?php

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * VideoTag Entity.
 *
 * @property int $id
 * @property int $video_id
 * @property \App\Model\Entity\Video $video
 * @property int $tag_id
 * @property \App\Model\Entity\Tag $tag
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property float $begin
 * @property float $end
 * @property \Cake\I18n\Time $created
 * @property string $status
 * @property int $count_points
 * @property \App\Model\Entity\VideoTagPoint[] $video_tag_points
 */
class VideoTag extends Entity {

    const STATUS_VALIDATED = 'validated';
    const STATUS_BLOCKED = 'blocked';
    const STATUS_PENDING = 'pending';
    const STATUS_REJECTED = 'rejected';
    const STATUS_DUPLICATE = 'duplicate';

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
        'id' => false,
        'user_id' => false,
        'created' => false,
        'count_points' => false,
        'status' => false,
        'rider_id' => true,
        'begin' => true, 
        'end' => true, 
        'tag_id' => true,
        'video_id' => true,
        '*' => false,
    ];

    public function isEditabled($userId) {
        return $this->status === self::STATUS_PENDING && $this->user_id === $userId;
    }

    public function generateSlug($rider, $tag) {
        $this->slug = $this->id . '-' . $tag['slug'] . '-by-' . (!empty($rider['slug']) ? $rider['slug'] : 'unknown');
    }

    //protected $_virtual = ['slug'];

    protected function _getSlug() {
        if (empty($this->slug)){
            return $this->id 
                    . (!empty($this->tag['slug']) ? '-'. $this->tag['slug'] : '')
                    . (!empty($this->rider['slug']) ? '-by-'.($this->rider['slug']) : '');
        }
        else {
            return $this->slug;
        }
    }

}
