<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Rider Entity.
 *
 * @property int $id
 * @property string $firstname
 * @property string $lastname
 * @property string $picture
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property bool $is_pro
 * @property string $provider_uid
 * @property string $social_provider_id
 * @property \App\Model\Entity\SocialProvider $social_provider
 * @property \App\Model\Entity\VideoTag[] $video_tags
 */
class Rider extends Entity
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
        'id' => false,
    ];
}
