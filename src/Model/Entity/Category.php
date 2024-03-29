<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Category Entity.
 *
 * @property int $id
 * @property string $name
 * @property int $sport_id
 * @property \App\Model\Entity\Sport $sport
 * @property \App\Model\Entity\Tag[] $tags
 */
class Category extends Entity
{
    const STATUS_PUBLIC = 'public';
    const STATUS_PRIVATE = 'private';

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
