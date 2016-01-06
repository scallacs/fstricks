<?php
namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * VideoTags Controller
 *
 * @property \App\Model\Table\VideoTagsTable $VideoTags
 */
class VideoTagsController extends AppController {

    
    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['view', 'best']);
    }
    
    /**
     * View method
     *
     * @param string|null $id Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null){
        $videoTag = $this->VideoTags->findAndJoin()
                ->where(['VideoTags.id' => $id])
                ->limit(1)
                ->first();
        ResultMessage::overwriteData($videoTag);
        ResultMessage::setWrapper(false);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        ResultMessage::setWrapper(true);
        $videoTag = $this->VideoTags->newEntity();
        if ($this->request->is('post')) {
            $data = $this->request->data;
            
            // Creating a new tag if needed !
            $createTag = isset($data['tag']);
            if ($createTag){
                // Create tag 
                $tagTable = \Cake\ORM\TableRegistry::get('Tags');
                $tagEntity = $tagTable->newEntity($data['tag']);
                $tagEntity->user_id = $this->Auth->user('id');
                if (!$tagTable->save($tagEntity)){
                    ResultMessage::addValidationErrorsModel($tagEntity);
                    ResultMessage::setMessage(__('Cannot create this trick'), false);
                    return; 
                }
                else{
                    ResultMessage::addStepSuccess("Adding a the new trick");
                }
                unset($data['tag']);
            }
            
            $videoTag = $this->VideoTags->patchEntity($videoTag, $data);
            $videoTag->user_id = $this->Auth->user('id');
            if ($createTag){
                $videoTag->tag_id = $tagEntity->id;
            }
            
            if ($this->VideoTags->save($videoTag)) {
                ResultMessage::setMessage(__('The video tag has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The video tag could not be saved. Please, try again.'), false);
                ResultMessage::addValidationErrorsModel($videoTag);
            }
        }
    }
    
    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function best() {
        $dayNumber = 10;
        $videoTag = $this->VideoTags->findAndJoin()
                ->order([
                    'VideoTags.count_points DESC',
                    'VideoTags.created DESC'
                ])
                ->where([
                    'VideoTags.created > timestampadd(day, -'.$dayNumber.' , now())'
                ])
                ->limit(200);
        ResultMessage::overwriteData($videoTag);
        ResultMessage::setWrapper(false);
    }
    

    /**
     * Return recently tagged video by user
     */
    public function recentlyTagged(){
        $data = $this->VideoTags->find('all')
                ->select([
                    'provider_id' => 'Videos.provider_id', 
                    'video_url' => 'Videos.video_url', 
                    'id' => 'Videos.id'
                ])
                ->limit(20)
                ->where(['VideoTags.user_id' => $this->Auth->user('id')])
                ->order(['VideoTags.created DESC'])
                ->contain(['Videos'])
                ->distinct(['Videos.id']);
        ResultMessage::overwriteData($data->all());
        ResultMessage::setWrapper(false);
    }
}
