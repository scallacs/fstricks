<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * VideoTagAccuracyRate Entity.
 *
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property int $video_tag_id
 * @property \App\Model\Entity\VideoTag $video_tag
 * @property string $value
 * @property \Cake\I18n\Time $created
 */
class VideoTagAccuracyRate extends Entity
{

    const VALUE_FAKE = 'fake';
    const VALUE_ACCURATE = 'accurate';
    
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
        'value' => false,
        'created' => false,
        'user_id' => false,
        'video_tag_id' => true
    ];
}
