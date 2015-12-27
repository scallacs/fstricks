<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Sport Entity.
 *
 * @property int $id
 * @property string $name
 * @property \App\Model\Entity\Category[] $categories
 * @property \App\Model\Entity\Tag[] $tags
 */
class Sport extends Entity
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
    
    public $_virtual  = ['image'];

    protected function _getImage(){
        return \Cake\Routing\Router::url('/img/'.$this->name.'.jpg', true);
    }
}
