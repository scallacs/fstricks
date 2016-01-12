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
    public function view($id = null) {
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
            if ($createTag) {
                // Create tag 
                $tagTable = \Cake\ORM\TableRegistry::get('Tags');
                $tagEntity = $tagTable->newEntity($data['tag']);
                $tagEntity->user_id = $this->Auth->user('id');
                if (!$tagTable->save($tagEntity)) {
                    ResultMessage::addValidationErrorsModel($tagEntity);
                    ResultMessage::setMessage(__('Cannot create this trick'), false);
                    return;
                } else {
                    ResultMessage::addStepSuccess("Adding a the new trick");
                }
                unset($data['tag']);
            }

            $videoTag = $this->VideoTags->patchEntity($videoTag, $data);
            $videoTag->user_id = $this->Auth->user('id');
            if ($createTag) {
                $videoTag->tag_id = $tagEntity->id;
            }

            if ($this->VideoTags->save($videoTag)) {
                ResultMessage::setMessage(__('Your trick has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('Your trick could not be saved, please check your inputs.'), false);
                ResultMessage::addValidationErrorsModel($videoTag);
            }
        }
    }

    /**
     * GET data
     *  - sport_id
     *  - category_id
     *  - tag_id
     *  - video_id
     *  - page: page number
     */
    public function search() {
        $limit = !empty($this->request->query['quantity']) && (int) $this->request->query['quantity'] < 20 ? $this->request->query['quantity'] : 10;
        $offset = ((!empty($this->request->query['page']) ? (int) $this->request->query['page'] : 1) - 1) * $limit;

        $query = $this->VideoTags->findAndJoin()
                ->offset($offset)
                ->limit($limit);

        if (!empty($this->request->query['order'])) {
            switch ($this->request->query['order']) {
                case 'begin_time':
                    $query->order([
                        'VideoTags.begin ASC',
                    ]);
                    break;
                case 'best':
                default:
                    $query->order([
                        'VideoTags.count_points DESC',
                        'VideoTags.created DESC'
                    ]);
            }
        }

        if (!empty($this->request->query['sport_id'])) {
            $query->where(['Tags.sport_id' => $this->request->query['sport_id']]);
        } else if (!empty($this->request->query['sport_name'])) {
            // Get id from name
            $sports = \Cake\ORM\TableRegistry::get('Sports');
            $sportName = strtolower($this->request->query['sport_name']);
            $sport = $sports->findFromNameCached($sportName);
            if (!empty($sport)) {
                $query->where(['Tags.sport_id' => $sport['id']]);
            }
        }
        if (!empty($this->request->query['category_id'])) {
            $query->where(['Tags.category_id' => $this->request->query['category_id']]);
        }
        else if (!empty($this->request->query['category_name']) && isset($sportName)) {
            $categoryName = strtolower($this->request->query['category_name']);
            $sports = \Cake\ORM\TableRegistry::get('Sports');
            $category = $sports->findFromCategoryCached($sportName, $categoryName);
            if (!empty($category)){
                $query->where(['Tags.category_id' => $category['id']]);
            }
        }
        
        if (!empty($this->request->query['tag_id'])) {
            $query->where(['VideoTags.tag_id' => $this->request->query['tag_id']]);
        }
        if (!empty($this->request->query['trick_name'])) {
            $query->where(['Tags.slug' => $this->request->query['trick_name']]);
        }
        if (!empty($this->request->query['video_id'])) {
            $query->where(['VideoTags.video_id' => (int)$this->request->query['video_id']]);
        }
//        if (!empty($this->request->query['with_total'])){
//            $data = [
//                
//            ]
//        }
        ResultMessage::overwriteData($query->all());
        ResultMessage::setWrapper(false);
    }

    /**
     * Find best tags
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function best() {
        $limit = 10; // TODO match with client side
        $offset = ((!empty($this->request->query['page']) ? (int) $this->request->query['page'] : 1) - 1) * $limit;

        //$dayNumber = 10;
        $videoTag = $this->VideoTags->findAndJoin()
                ->order([
                    'VideoTags.count_points DESC',
                    'VideoTags.created DESC'
                ])
                ->offset($offset)
                ->limit($limit);
        $count = null;
        if ($offset === 0) {
            $count = $this->VideoTags->find('all')->where([
                        'VideoTags.status' => \App\Model\Entity\VideoTag::STATUS_VALIDATED,
                        'VideoTags.count_points >=' => 'VideoTags.count_report_errors'
                    ])->count();
        }
        ResultMessage::overwriteData([
            'data' => $videoTag,
            'size' => $count
        ]);

        ResultMessage::setWrapper(false);
    }

    /**
     * Return recently tagged video by user
     */
    public function recentlyTagged() {
        $limit = 5;
        $offset = ((!empty($this->request->query['page']) ? (int) $this->request->query['page'] : 1) - 1) * $limit;
        $data = $this->VideoTags->find('all')
                ->select([
                    'provider_id' => 'Videos.provider_id',
                    'video_url' => 'Videos.video_url',
                    'id' => 'Videos.id'
                ])
                ->limit($limit)
                ->offset($offset)
                ->where(['VideoTags.user_id' => $this->Auth->user('id')])
                ->order(['VideoTags.created DESC'])
                ->contain(['Videos'])
                ->distinct(['Videos.id']);
        if (!empty($this->request->query['total_number'])){
            // TODO 
        }
        ResultMessage::overwriteData($data->all());
        ResultMessage::setWrapper(false);
    }

}
