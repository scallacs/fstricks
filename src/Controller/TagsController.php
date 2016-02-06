<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;

/**
 * Tags Controller
 *
 * @property \App\Model\Table\TagsTable $Tags
 */
class TagsController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['suggest', 'view']);
    }

    // -------------------------------------------------------------------------
    // API
    public function view($sportName = null, $category = null, $trick = null) {
        ResultMessage::setWrapper(false);
        // TODO rewrite query from video tag point of view ? 
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $sportsTable = \Cake\ORM\TableRegistry::get('Sports');
       
        $conditions = [];
        
        if ($sportName !== null){

            $sport = $sportsTable->findFromNameCached($sportName); 
            if ($sport === null){
                return;
            }
            $conditions['Tags.sport_id'] = $sport['id'];
            
            if ($category !== null){
                $category = $sportsTable->findFromCategoryCached($sportName, $category); 
                if ($category === null){
                    return;
                }
                $conditions['Tags.category_id'] = $category['id'];
                
                if ($trick !== null){
                    $conditions['Tags.slug'] = strtolower($trick);
                }
            }
        }
        
        $query = $videoTagsTable->findAndJoin()
                ->where($conditions);
        ResultMessage::overwriteData($query->all());
    }

    /**
     * @queryType GET
     * 
     * Return a list of the most famous tag begining by the search term $term
     * @param string $term
     */
    public function suggest($term = '') {
        $query = $this->Tags->find('all')
                ->select([
                    'name' => 'Tags.name',
                    'slug' => 'Tags.slug',
                    'count_ref' => 'Tags.count_ref',
                    'id' => 'Tags.id',
                    'sport_id' => 'Tags.sport_id',
                    'category_id' => 'Tags.category_id',
                    'category_name' => 'Categories.name',
                    'sport_name' => 'Sports.name'])
                ->where([
                    'Tags.name LIKE' => '%' . $term . '%',
                    'Tags.count_ref > 0'
                ])
                ->contain(['Categories', 'Sports'])
                ->limit(20)
                ->order(['Tags.count_ref DESC']);
        if (!empty($this->request->query['sport_id'])) {
            $query->where(['Tags.sport_id' => $this->request->query['sport_id']]);
        }
        if (!empty($this->request->query['category_id'])) {
            $query->where(['Tags.category_id' => $this->request->query['category_id']]);
        }
        ResultMessage::overwriteData($query->all());
        ResultMessage::setWrapper(false);
    }

    /**
     * @queryType POST
     */
    public function add() {
        ResultMessage::setWrapper(true);
        if ($this->request->is('post')) {
            $tag = $this->Tags->newEntity();
            $tag = $this->Tags->patchEntity($tag, $this->request->data);
            $tag->user_id = $this->Auth->user('id');

            if ($this->Tags->save($tag)) {
                ResultMessage::setMessage(__('The tag has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The tag could not be saved. Please, try again.'), false);
                ResultMessage::addValidationErrorsModel($tag);
            }
        }
    }

}
