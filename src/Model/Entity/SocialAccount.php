<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * SocialAccount Entity.
 *
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property string $social_provider_id
 * @property \App\Model\Entity\SocialProvider $social_provider
 * @property \Cake\I18n\Time $created
 */
class SocialAccount extends Entity
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
        'user_id' => false,
        'social_provider_id' => false,
    ];
}
