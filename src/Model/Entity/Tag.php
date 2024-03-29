<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Tag Entity.
 */
class Tag extends Entity {

    const STATUS_VALIDATED = 'validated';
    
    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     * Note that '*' is set to true, which allows all unspecified fields to be
     * mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        '*' => true,
        'id' => false,
        'count_ref' => false,
        'created' => false,
        'user_id' => false,
        'slug' => false
    ];
    
    public function generateSlug($category){
        $this->slug = $category['sport']['slug'].'-'.$category['slug'].'-'.\Cake\Utility\Inflector::slug($this->name);
        return $this->slug;
    }
    
    public function _setName($name){
        return \App\Lib\DataUtil::lowernamenumeric($name);
    }
}
