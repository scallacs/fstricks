<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Feedback Entity.
 *
 * @property int $id
 * @property string $browser
 * @property string $url
 * @property string $note
 * @property string $img
 * @property string $html
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property \Cake\I18n\Time $created
 * @property string $status
 */
class Feedback extends Entity
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
