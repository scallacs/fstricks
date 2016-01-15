<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * ReportError Entity.
 *
 * @property int $id
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property int $error_type_id
 * @property \App\Model\Entity\ErrorType $error_type
 * @property int $video_tag_id
 * @property \App\Model\Entity\VideoTag $video_tag
 * @property string $comment
 * @property \Cake\I18n\Time $created
 */
class ReportError extends Entity
{
    const STATUS_PENDING = 'pending';

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
