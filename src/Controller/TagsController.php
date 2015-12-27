<?php
namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * Tags Controller
 *
 * @property \App\Model\Table\TagsTable $Tags
 */
class TagsController extends AppController
{

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['suggest']);
    }
    // -------------------------------------------------------------------------
    // API
    
    
    public function view($sport = null, $category = null, $trick = null){
        ResultMessage::setWrapper(false);
        
        $query = $this->Tags->find('all')
                ->where([
                    'Tags.slug' => strtolower($trick),
                    'Sports.name' => strtolower($sport),
                    'Categories.name' => strtolower($category)
                ])
                ->contain(['Sports', 'Categories', 'VideoTags' => function ($q){
                    return $q->contain(['Videos']);
                }])
                ->limit(1);
        
        ResultMessage::overwriteData($query->all());
    }
    
    /**
     * @queryType GET
     * 
     * Return a list of the most famous tag begining by the search term $term
     * @param string $term
     */
    public function suggest($term = ''){
        $query = $this->Tags->find('all')
                    ->select(['name' => 'Tags.name', 
                        'count_ref' => 'Tags.count_ref', 
                        'id' => 'Tags.id',
                        'sport_id' => 'Tags.sport_id', 
                        'category_id' => 'Tags.category_id',
                        'category_name' => 'Categories.name', 
                        'sport_name' => 'Sports.name'])
                    ->where(['Tags.name LIKE' => '%'.$term.'%'])
                    ->contain(['Categories', 'Sports'])
                    ->limit(20)
                    ->order(['Tags.count_ref DESC']);
        if (!empty($this->request->query['sport_id'])){
            $query->where(['Tags.sport_id' => $this->request->query['sport_id']]);
        }
        if (!empty($this->request->query['category_id'])){
            $query->where(['Tags.category_id' => $this->request->query['category_id']]);
        }
        ResultMessage::overwriteData($query->all());
        ResultMessage::setWrapper(false);
    }
    
    /**
     * @queryType POST
     */
    public function add(){
        ResultMessage::setWrapper(true);
        if ($this->request->is('post')){
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
