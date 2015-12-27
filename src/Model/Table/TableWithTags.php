<?php

namespace App\Model\Table;
use Cake\ORM\Table;


/**
 * TODO behavior ? 
 */
class TableWithTags extends Table {
    
    const MIN_TAG_LENGTH = 2;
    const TAG_GLUE = ',';
    
    
    public function initialize(array $config) {
        parent::initialize($config);
        $this->belongsToMany('Tags');
    }
    /**
     * 
     * @param type $tagString
     * @return list of new tags added in the database
     */
    protected function _buildTags(&$entity) {
        $tagString = $entity->tag_string;
        $entity->tag_string = '';
        $new = [];
        foreach (explode(',', $tagString) as $tag){
            $tag = trim($tag);
            if (strlen($tag) >= self::MIN_TAG_LENGTH && !in_array($tag, $new)){
                $entity->tag_string .= $tag.self::TAG_GLUE; 
                $new[] = strtolower($tag);
            }
        }
        if (count($new) === 0){
            return $new;
        }
        $entity->tag_string = trim($entity->tag_string, self::TAG_GLUE);
        
        $out = [];
        $query = $this->Tags->find()
                ->where(['Tags.name IN' => $new]);

        // Remove existing tags from the list of new tags.
        foreach ($query->extract('name') as $existing) {
            $index = array_search($existing, $new);
            if ($index !== false) {
                unset($new[$index]);
            }
        }
        // Add existing tags.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Add new tags.
        foreach ($new as $tag) {
            $id = $this->Tags->newEntity(['name' => $tag]);
            if ($id !== 0){
                $out[] = $id;
            }
        }
        $entity->tags = $out;
    }

    
    public function beforeSave($event, $entity, $options) {
        if ($entity->tag_string) {
            $this->_buildTags($entity);
        }
    }
}