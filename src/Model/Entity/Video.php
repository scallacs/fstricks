<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Video Entity.
 *
 * @property int $id
 * @property string $video_id
 * @property string $provider_id
 * @property int $count_tags
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property \Cake\I18n\Time $created
 * @property \App\Model\Entity\Video[] $videos
 * @property \App\Model\Entity\VideoProvider $video_provider
 * @property \App\Model\Entity\VideoTag[] $video_tags
 */
class Video extends Entity
{

    const STATUS_PRIVATE = 'private';
    const STATUS_PUBLIC = 'public';
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
        'count_tags' => false,
        'id' => false,
        'duration' => false
    ];
    
    
    /**
     * 
     * @return type
     */
    public function getProviderDuration(){
        try {
            return \App\Lib\VideoRequestFactory::instance($this->provider_id)->duration($this->video_url);
        } catch (Exception $ex) {
            return 0;
        }
    }
}
